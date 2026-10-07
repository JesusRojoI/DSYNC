const OCTANO_BASE_URL = process.env.OCTANO_BASE_URL || 'https://pagos.octanopayments.com/api/v1'
const OCTANO_EMAIL = process.env.OCTANO_EMAIL || process.env.OCTANO_USER
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
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        email: OCTANO_EMAIL,
        password: OCTANO_PASSWORD,
      }),
    })

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      data = { raw: responseText }
    }

    if (!response.ok) {
      const errMessage = data.message || data.error || data.raw || 'Error de autenticación'
      throw new Error(`Octano signin (${response.status}): ${errMessage}`)
    }

    const token = data.authToken
    if (!token) throw new Error('No se recibió token en la respuesta')

    authToken = token
    tokenExpiry = Date.now() + 15 * 60 * 1000
    console.log('✅ Autenticación exitosa')
    return authToken
  } catch (error) {
    console.error('❌ Error autenticando:', error.message)
    if (process.env.NODE_ENV === 'development') return 'simulated-token'
    throw error
  }
}

export async function tokenizarTarjeta(token, cardData) {
  if (token === 'simulated-token') {
    return {
      token: `tok_sim_${Date.now()}`,
      last4: cardData.number.slice(-4),
    }
  }

  const response = await fetch(`${OCTANO_BASE_URL}/card/tokenizer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
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

  const responseText = await response.text()
  let data
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    data = { raw: responseText }
  }

  console.log('📥 Respuesta Octano /card/tokenizer:', JSON.stringify(data, null, 2))

  if (!response.ok) {
    const errMessage = data.message || data.error || data.raw || 'Error tokenizando tarjeta'
    throw new Error(`Octano tokenizer (${response.status}): ${errMessage}`)
  }

  const cardNumberToken = data.cardNumberToken || data.token
  if (!cardNumberToken) throw new Error('No se recibió token de tarjeta')

  return {
    token: cardNumberToken,
    last4: cardData.number.slice(-4),
  }
}

export async function procesarPago(token, datos) {
  // Modo simulación (desarrollo sin credenciales)
  if (token === 'simulated-token') {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      success: true,
      needsRedirect: false,
      redirectUrl: null,
      orderId: datos.orderId,
      reference: datos.orderId,
      status: 'APPROVED',
      transactionId: `TXN-SIM-${Date.now()}`,
      message: 'Pago simulado exitosamente',
    }
  }

  const salePayload = {
    amount: Number(datos.amount),
    currency: '484', // MXN
    reference: datos.orderId,
    redirectUrl: datos.redirectUrl || undefined,

    customerInformation: {
      firstName: datos.customer?.firstName || 'N/A',
      lastName: datos.customer?.lastName || 'N/A',
      email: datos.customer?.email || '',
      phone1: datos.customer?.phone || '',
      address1: datos.customer?.address1 || '',
      address2: datos.customer?.address2 || '',
      city: datos.customer?.city || '',
      state: datos.customer?.state || '',
      postalCode: datos.customer?.postalCode || '',
      country: datos.customer?.country || 'MX',
      company: datos.customer?.company || '',
      ip: datos.metadata?.ip || '127.0.0.1',
    },

    cardData: {
      cardNumberToken: datos.cardToken,
      cvv: datos.cvv,
    },
  }

  console.log('📤 Enviando a Octano /sale:', JSON.stringify({
    ...salePayload,
    cardData: { ...salePayload.cardData, cvv: '***' }
  }, null, 2))

  const response = await fetch(`${OCTANO_BASE_URL}/sale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(salePayload),
  })

  // Leer el cuerpo primero (aunque sea error) para ver el detalle
  const responseText = await response.text()
  let data
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    data = { raw: responseText }
  }

  console.log('📥 Respuesta Octano /sale:', JSON.stringify(data, null, 2))

  if (!response.ok) {
    const errMessage = data.message || data.error || data.raw || 'Error procesando pago'
    throw new Error(`Octano sale (${response.status}): ${errMessage}`)
  }

  const isApproved = data.status === 'APPROVED'
  const needsRedirect = !!data.redirectTo && data.redirectTo !== ''

  return {
    success: isApproved,
    needsRedirect,
    redirectUrl: data.redirectTo || null,
    orderId: data.orderId || data.reference || datos.orderId,
    reference: data.reference || datos.orderId,
    status: data.status,
    transactionId: data.transactionId || data.id,
    message: data.message || (isApproved ? 'Pago aprobado' : 'Pago rechazado'),
    data: data,
  }
}