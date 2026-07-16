const OCTANO_BASE_URL = process.env.OCTANO_BASE_URL || 'https://pagos.octanopayments.com/api/v1'
const OCTANO_EMAIL = process.env.OCTANO_EMAIL
const OCTANO_PASSWORD = process.env.OCTANO_PASSWORD

let authToken = null
let tokenExpiry = null

export async function octanoLogin() {
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return authToken
  }

  try {
    console.log('🔐 Autenticando con Octano...')
    
    if (!OCTANO_EMAIL || !OCTANO_PASSWORD) {
      console.warn('⚠️ Credenciales de Octano no configuradas. Usando modo simulación.')
      return 'simulated-token'
    }

    const response = await fetch(`${OCTANO_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: OCTANO_EMAIL, password: OCTANO_PASSWORD }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error de autenticación')
    }

    const data = await response.json()
    if (!data.authToken) throw new Error('No se recibió token')

    authToken = data.authToken
    tokenExpiry = Date.now() + 15 * 60 * 1000
    console.log('✅ Autenticación exitosa')
    return authToken
  } catch (error) {
    console.error('❌ Error autenticando:', error)
    if (process.env.NODE_ENV === 'development') return 'simulated-token'
    throw error
  }
}

export async function tokenizarTarjeta(token, cardData) {
  if (token === 'simulated-token') {
    return { 
      token: `tok_sim_${Date.now()}`, 
      last4: cardData.number.slice(-4) 
    }
  }

  const response = await fetch(`${OCTANO_BASE_URL}/card/tokenizer`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      cardData: {
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.name,
        expirationYear: `20${cardData.year}`,
        expirationMonth: cardData.month,
      },
    }),
  })

  if (!response.ok) throw new Error('Error tokenizando tarjeta')
  const data = await response.json()
  return { 
    token: data.cardNumberToken || data.token, 
    last4: cardData.number.slice(-4) 
  }
}

export async function procesarPago(token, datos) {
  if (token === 'simulated-token') {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return { 
      success: true, 
      orderId: datos.orderId, 
      status: 'approved', 
      transactionId: `TXN-SIM-${Date.now()}`, 
      message: 'Pago simulado exitosamente' 
    }
  }

  const response = await fetch(`${OCTANO_BASE_URL}/sale`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      amount: Number(datos.amount),
      currency: '484',
      reference: datos.orderId,
      customerInformation: {
        firstName: datos.customerName?.split(' ')[0] || 'N/A',
        lastName: datos.customerName?.split(' ').slice(1).join(' ') || 'N/A',
        email: datos.customerEmail,
        ip: '127.0.0.1',
      },
      cardData: { 
        cardNumberToken: datos.cardToken, 
        cvv: datos.cvv 
      },
    }),
  })

  if (!response.ok) throw new Error('Error procesando pago')
  const data = await response.json()
  
  return {
    success: data.status === 'APPROVED',
    orderId: datos.orderId,
    status: data.status === 'APPROVED' ? 'approved' : 'rejected',
    transactionId: data.transactionId || data.id,
    message: data.message || (data.status === 'APPROVED' ? 'Pago aprobado' : 'Pago rechazado'),
  }
}