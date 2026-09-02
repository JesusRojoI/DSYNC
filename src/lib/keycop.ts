'use server'
import axios from 'axios'

const KEYCOP_API_URL: string = process.env.KEYCOP_API_URL || 'https://pagos.keycop.com.mx/api/v1'
const KEYCOP_EMAIL: string | undefined = process.env.KEYCOP_EMAIL
const KEYCOP_PASSWORD: string | undefined = process.env.KEYCOP_PASSWORD

let authToken: string | null = null
let tokenExpiry: number | null = null

async function getAuthToken(): Promise<string> {
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return authToken
  }

  try {
    console.log('🔐 Autenticando con Keycop...')
    
    if (!KEYCOP_EMAIL || !KEYCOP_PASSWORD) {
      console.warn('⚠️ Credenciales de Keycop no configuradas. Usando modo simulación.')
      return 'simulated-token'
    }

    const { data } = await axios.post(`${KEYCOP_API_URL}/signin`, {
      email: KEYCOP_EMAIL,
      password: KEYCOP_PASSWORD,
    })

    if (!data.authToken) throw new Error('No se recibió token')

    authToken = data.authToken
    tokenExpiry = Date.now() + 15 * 60 * 1000
    console.log('✅ Autenticación exitosa')
    return authToken as string
  } catch (error: unknown) {
    const err = error as { response?: { data?: any }; message?: string }
    console.error('❌ Error autenticando:', err.response?.data || err.message)
    if (process.env.NODE_ENV === 'development') return 'simulated-token'
    throw error
  }
}

interface CardData {
  number: string
  name: string
  month: string
  year: string
}

async function tokenizeCard(token: string, cardData: CardData): Promise<{ cardNumberToken: string; last4: string }> {
  if (token === 'simulated-token') {
    return {
      cardNumberToken: `tok_sim_${Date.now()}`,
      last4: cardData.number.slice(-4),
    }
  }

  const { data } = await axios.post(
    `${KEYCOP_API_URL}/card/tokenizer`,
    {
      cardData: {
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.name,
        expirationYear: cardData.year,
        expirationMonth: cardData.month,
      },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  return {
    cardNumberToken: data.cardNumberToken,
    last4: cardData.number.slice(-4),
  }
}

interface PaymentData {
  amount: number
  orderId: string
  cardData: CardData & { cvv: string }
  customer: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    direccion: string
    direccion2?: string
    ciudad: string
    estado: string
    pais?: string
    cp: string
    empresa?: string
  }
  metadata?: {
    ip?: string
    deviceId?: string
    notes?: string
  }
}

export async function processKeycopPayment(paymentData: PaymentData) {
  try {
    const authToken = await getAuthToken()

    let cardToken: string
    let last4: string

    if (authToken === 'simulated-token') {
      cardToken = `tok_sim_${Date.now()}`
      last4 = paymentData.cardData.number.slice(-4)
      console.log('🔧 [MODO SIMULACIÓN] Token simulado:', cardToken)
    } else {
      const tokenizado = await tokenizeCard(authToken, {
        number: paymentData.cardData.number,
        name: paymentData.cardData.name,
        month: paymentData.cardData.month,
        year: paymentData.cardData.year,
      })
      cardToken = tokenizado.cardNumberToken
      last4 = tokenizado.last4
      console.log('✅ Tarjeta tokenizada. Últimos 4 dígitos:', last4)
    }

    if (authToken === 'simulated-token') {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return {
        success: true,
        orderId: paymentData.orderId,
        reference: paymentData.orderId,
        status: 'APPROVED',
        transactionId: `TXN-SIM-${Date.now()}`,
        message: 'Pago simulado exitosamente',
        last4,
      }
    }

    const salePayload = {
      amount: Number(paymentData.amount),
      currency: '484',
      reference: paymentData.orderId,
      customerInformation: {
        firstName: paymentData.customer.nombre,
        lastName: paymentData.customer.apellido,
        email: paymentData.customer.email,
        phone1: paymentData.customer.telefono,
        address1: paymentData.customer.direccion,
        address2: paymentData.customer.direccion2 || '',
        city: paymentData.customer.ciudad,
        state: paymentData.customer.estado,
        postalCode: paymentData.customer.cp,
        country: paymentData.customer.pais || 'MX',
        company: paymentData.customer.empresa || '',
        ip: paymentData.metadata?.ip || '127.0.0.1',
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: paymentData.cardData.cvv,
      },
    }

    const { data } = await axios.post(`${KEYCOP_API_URL}/sale`, salePayload, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    return {
      success: data.status === 'APPROVED',
      orderId: data.orderId || paymentData.orderId,
      reference: data.reference || paymentData.orderId,
      status: data.status,
      transactionId: data.transactionId || data.id || `TXN-${Date.now()}`,
      message: data.message || (data.status === 'APPROVED' ? 'Pago aprobado' : 'Pago rechazado'),
      data: data,
      last4,
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    console.error('❌ Keycop Payment Error:', err.response?.data || err.message)
    return {
      success: false,
      status: 'error',
      error: err.response?.data?.message || 'Error procesando el pago',
    }
  }
}