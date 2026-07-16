import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error al parsear el body:', parseError)
      return NextResponse.json(
        { success: false, error: 'Datos inválidos en la solicitud' },
        { status: 400 }
      )
    }

    const {
      nombre,
      apellido,
      email,
      direccion,
      poblacion,
      region,
      codigoPostal,
      telefono,
      nombreTarjeta,
      numeroTarjeta,
      fechaExpiracion,
      cvv,
      cartItems,
      subtotal,
      iva,
      total,
      language
    } = body

    // Validar datos requeridos
    if (!nombre || !apellido || !email || !numeroTarjeta || !fechaExpiracion || !cvv) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos para el pago' },
        { status: 400 }
      )
    }

    const lang = language || 'es'
    const isEnglish = lang === 'en'

    // Generar un ID de pedido local por si falla Octano
    const localOrderId = `DSYNC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    let paymentResult = null
    let paymentSuccess = false

    // Intentar procesar con Octano Payments
    try {
      console.log('Intentando autenticar con Octano Payments...')
      
      const authResponse = await fetch(`${process.env.OCTANO_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.OCTANO_EMAIL,
          password: process.env.OCTANO_PASSWORD,
        }),
      })

      if (!authResponse.ok) {
        const authErrorText = await authResponse.text()
        console.error('Error de autenticación Octano:', authErrorText)
        throw new Error('Error de autenticación con el proveedor de pagos')
      }

      const authText = await authResponse.text()
      let authData
      try {
        authData = JSON.parse(authText)
      } catch (e) {
        console.error('Respuesta de auth no es JSON:', authText)
        throw new Error('Respuesta inválida del proveedor de pagos')
      }

      const token = authData.token || authData.access_token

      if (!token) {
        console.error('No se recibió token:', authData)
        throw new Error('No se pudo obtener token de autenticación')
      }

      console.log('Autenticación exitosa, procesando pago...')

      // Preparar datos de la tarjeta
      const cardNumber = numeroTarjeta.replace(/\s/g, '')
      const expDate = fechaExpiracion.replace(/\s/g, '').replace('/', '')
      const expMonth = expDate.slice(0, 2)
      const expYear = '20' + expDate.slice(2, 4)

      const paymentData = {
        amount: Math.round(total * 100) / 100, // Asegurar 2 decimales
        currency: 'MXN',
        description: `Compra DSYNC - ${nombre} ${apellido}`,
        card: {
          number: cardNumber,
          holder_name: nombreTarjeta,
          exp_month: expMonth,
          exp_year: expYear,
          cvv: cvv,
        },
        customer: {
          name: nombre,
          lastname: apellido,
          email: email,
          phone: telefono || '',
          address: {
            street: direccion,
            city: poblacion,
            state: region,
            zip: codigoPostal,
            country: 'MX',
          },
        },
        metadata: {
          products: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }

      const paymentResponse = await fetch(`${process.env.OCTANO_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const paymentText = await paymentResponse.text()
      
      if (!paymentResponse.ok) {
        console.error('Error en pago Octano:', paymentText)
        let errorMsg = 'Error al procesar el pago'
        try {
          const errorData = JSON.parse(paymentText)
          errorMsg = errorData.message || errorData.error || errorMsg
        } catch (e) {
          errorMsg = paymentText || errorMsg
        }
        throw new Error(errorMsg)
      }

      try {
        paymentResult = JSON.parse(paymentText)
        paymentSuccess = true
        console.log('Pago procesado exitosamente:', paymentResult.id || paymentResult.transaction_id)
      } catch (e) {
        console.error('Respuesta de pago no es JSON:', paymentText)
        throw new Error('Respuesta inválida del proveedor de pagos')
      }

    } catch (octanoError) {
      console.error('Error con Octano Payments:', octanoError.message)
      
      // Si estamos en desarrollo, simulamos un pago exitoso
      if (process.env.NODE_ENV === 'development') {
        console.log('MODO DESARROLLO: Simulando pago exitoso')
        paymentSuccess = true
        paymentResult = {
          id: localOrderId,
          transaction_id: localOrderId,
          status: 'approved',
          simulated: true
        }
      } else {
        // En producción, devolvemos el error
        return NextResponse.json(
          { 
            success: false, 
            error: octanoError.message || 'Error al procesar el pago con el proveedor' 
          },
          { status: 500 }
        )
      }
    }

    // Si el pago fue exitoso (real o simulado), enviar correos
    if (paymentSuccess) {
      const orderId = paymentResult.id || paymentResult.transaction_id || localOrderId

      try {
        console.log('Enviando correos de confirmación...')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const formatPrice = (price) => {
          return price.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }

        const productsList = cartItems.map(item => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              <strong>${item.name}</strong>
              <br><span style="color: #6b7280; font-size: 12px;">× ${item.quantity}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
              ${formatPrice(item.price * item.quantity)} MXN
            </td>
          </tr>
        `).join('')

        const texts = {
          subject: isEnglish 
            ? `Payment Confirmed - Order #${orderId}`
            : `Pago Confirmado - Pedido #${orderId}`,
          title: isEnglish ? 'Payment Confirmed!' : '¡Pago Confirmado!',
          greeting: isEnglish ? `Hello ${nombre},` : `Hola ${nombre},`,
          thankYou: isEnglish 
            ? 'Thank you for your purchase. Your payment has been processed successfully.'
            : 'Gracias por tu compra. Tu pago ha sido procesado exitosamente.',
          orderSummary: isEnglish ? 'Order Summary' : 'Resumen del Pedido',
          orderIdLabel: isEnglish ? 'Order ID' : 'ID del Pedido',
          dateLabel: isEnglish ? 'Date' : 'Fecha',
          product: isEnglish ? 'Product' : 'Producto',
          totalLabel: isEnglish ? 'Total' : 'Total',
          subtotalLabel: isEnglish ? 'Subtotal' : 'Subtotal',
          ivaLabel: isEnglish ? 'VAT (16%)' : 'IVA (16%)',
          totalAmount: isEnglish ? 'Total Amount' : 'Total',
          customerInfo: isEnglish ? 'Customer Information' : 'Información del Cliente',
          nameLabel: isEnglish ? 'Name' : 'Nombre',
          emailLabel: isEnglish ? 'Email' : 'Email',
          addressLabel: isEnglish ? 'Address' : 'Dirección',
          phoneLabel: isEnglish ? 'Phone' : 'Teléfono',
          paymentMethod: isEnglish ? 'Payment Method' : 'Método de Pago',
          creditCard: isEnglish ? 'Credit/Debit Card' : 'Tarjeta de Crédito/Débito',
          lastDigits: isEnglish ? 'Last digits' : 'Últimos dígitos',
          supportMessage: isEnglish 
            ? 'If you have any questions about your order, please contact us at'
            : 'Si tienes alguna pregunta sobre tu pedido, contáctanos en',
          regards: isEnglish ? 'Best regards,' : 'Saludos cordiales,',
          team: isEnglish ? 'DSYNC Team' : 'Equipo DSYNC',
        }

        const lastFourDigits = cardNumber ? cardNumber.slice(-4) : '****'

        const emailContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #111827; color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
                .success-badge { display: inline-block; background: #10b981; color: white; padding: 8px 20px; border-radius: 25px; font-size: 14px; margin-top: 15px; }
                .order-info { background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .order-table th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 14px; }
                .total-row { background: #111827; color: white; }
                .total-row td { padding: 15px 12px; font-size: 18px; font-weight: bold; }
                .customer-info { background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .footer { background: #f9fafb; padding: 20px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: 0; text-align: center; }
                .footer p { color: #6b7280; font-size: 14px; }
                .card-badge { display: inline-flex; align-items: center; background: #e5e7eb; padding: 5px 15px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0; font-size: 28px;">${texts.title}</h1>
                  <div class="success-badge">✓ ${texts.subject}</div>
                </div>
                
                <div class="content">
                  <p style="font-size: 16px;">${texts.greeting}</p>
                  <p style="font-size: 16px; color: #374151;">${texts.thankYou}</p>
                  
                  <div class="order-info">
                    <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #111827;">${texts.orderSummary}</h2>
                    <p style="margin: 5px 0;"><strong>${texts.orderIdLabel}:</strong> #${orderId}</p>
                    <p style="margin: 5px 0;"><strong>${texts.dateLabel}:</strong> ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  
                  <table class="order-table">
                    <thead>
                      <tr>
                        <th>${texts.product}</th>
                        <th style="text-align: right;">${texts.totalLabel}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productsList}
                      <tr>
                        <td style="padding: 12px; text-align: right;"><strong>${texts.subtotalLabel}</strong></td>
                        <td style="padding: 12px; text-align: right;">${formatPrice(subtotal)} MXN</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px; text-align: right;"><strong>${texts.ivaLabel}</strong></td>
                        <td style="padding: 12px; text-align: right;">${formatPrice(iva)} MXN</td>
                      </tr>
                      <tr class="total-row">
                        <td style="padding: 15px 12px; text-align: right;"><strong>${texts.totalAmount}</strong></td>
                        <td style="padding: 15px 12px; text-align: right;">${formatPrice(total)} MXN</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div class="customer-info">
                    <h3 style="margin: 0 0 15px 0; color: #111827;">${texts.customerInfo}</h3>
                    <p style="margin: 5px 0;"><strong>${texts.nameLabel}:</strong> ${nombre} ${apellido}</p>
                    <p style="margin: 5px 0;"><strong>${texts.emailLabel}:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>${texts.addressLabel}:</strong> ${direccion}, ${poblacion}, ${region}, CP ${codigoPostal}</p>
                    ${telefono ? `<p style="margin: 5px 0;"><strong>${texts.phoneLabel}:</strong> ${telefono}</p>` : ''}
                  </div>
                  
                  <div class="customer-info">
                    <h3 style="margin: 0 0 15px 0; color: #111827;">${texts.paymentMethod}</h3>
                    <p style="margin: 5px 0;">${texts.creditCard}</p>
                    <div class="card-badge">
                      💳 •••• •••• •••• ${lastFourDigits}
                    </div>
                  </div>
                  
                  <p style="margin-top: 30px; color: #6b7280;">
                    ${texts.supportMessage} <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #111827; font-weight: bold;">${process.env.ADMIN_EMAIL}</a>
                  </p>
                </div>
                
                <div class="footer">
                  <p>${texts.regards}<br><strong>${texts.team}</strong></p>
                  <p style="margin-top: 15px; font-size: 12px;">
                    © ${new Date().getFullYear()} DSYNC. ${isEnglish ? 'All rights reserved.' : 'Todos los derechos reservados.'}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `

        // Enviar correo al usuario
        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: [email],
          subject: texts.subject,
          html: emailContent,
        })

        // Enviar notificación al admin
        const adminSubject = isEnglish
          ? `New Order #${orderId} - ${nombre} ${apellido}`
          : `Nuevo Pedido #${orderId} - ${nombre} ${apellido}`

        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: [process.env.ADMIN_EMAIL],
          subject: adminSubject,
          html: emailContent,
        })

        console.log('Correos enviados exitosamente')
      } catch (emailError) {
        console.error('Error al enviar correos:', emailError)
        // No bloqueamos la respuesta por error en correos
      }

      return NextResponse.json({
        success: true,
        orderId: orderId,
        message: isEnglish ? 'Payment processed successfully' : 'Pago procesado exitosamente',
      })
    }

  } catch (error) {
    console.error('Error general en el proceso de pago:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}