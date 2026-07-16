import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { octanoLogin, tokenizarTarjeta, procesarPago } from '../../../lib/octano'

export async function POST(request) {
  try {
    const body = await request.json()
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

    console.log('💳 [PAGO] Iniciando proceso para:', `${nombre} ${apellido}`)
    console.log('🌐 [PAGO] Locale:', language || 'es')

    const customerName = `${nombre} ${apellido}`
    const orderId = `DSYNC-${Date.now().toString(36).toUpperCase()}`
    const lang = language || 'es'
    const isEnglish = lang === 'en'

    // 1. Autenticar con Octano
    const token = await octanoLogin()
    if (!token) {
      return NextResponse.json(
        { success: false, error: isEnglish ? 'Authentication error with payment processor' : 'Error de autenticación con el procesador de pagos' },
        { status: 500 }
      )
    }

    // 2. Tokenizar tarjeta
    let cardToken
    let last4

    if (token === 'simulated-token') {
      cardToken = `tok_sim_${Date.now()}`
      last4 = numeroTarjeta.replace(/\s/g, '').slice(-4)
      console.log('🔧 [MODO SIMULACIÓN] Token simulado:', cardToken)
    } else {
      const expMonth = fechaExpiracion.replace(/\s/g, '').slice(0, 2)
      const expYear = fechaExpiracion.replace(/\s/g, '').slice(2, 4)

      const tokenizado = await tokenizarTarjeta(token, {
        number: numeroTarjeta.replace(/\s/g, ''),
        name: nombreTarjeta,
        month: expMonth,
        year: expYear,
      })
      cardToken = tokenizado.token
      last4 = tokenizado.last4
      console.log('✅ Tarjeta tokenizada. Últimos 4 dígitos:', last4)
    }

    // 3. Procesar pago
    const resultado = await procesarPago(token, {
      amount: Math.round(total * 100) / 100,
      orderId,
      customerName,
      customerEmail: email,
      cardToken,
      cvv: cvv || '000',
    })

    console.log('💰 Resultado del pago:', resultado.status)

    // 4. Enviar emails de confirmación si el pago fue aprobado
    if (resultado.success || resultado.status === 'approved') {
      try {
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
          cardLabel: isEnglish ? 'Card' : 'Tarjeta',
          transactionLabel: isEnglish ? 'Transaction' : 'Transacción',
          productLabel: isEnglish ? 'Product' : 'Producto',
          totalLabel: isEnglish ? 'Total' : 'Total',
          subtotalLabel: isEnglish ? 'Subtotal' : 'Subtotal',
          ivaLabel: isEnglish ? 'VAT (16%)' : 'IVA (16%)',
          totalAmountLabel: isEnglish ? 'Total Amount' : 'Total',
          customerInfo: isEnglish ? 'Customer Information' : 'Información del Cliente',
          nameLabel: isEnglish ? 'Name' : 'Nombre',
          emailLabel: isEnglish ? 'Email' : 'Email',
          addressLabel: isEnglish ? 'Address' : 'Dirección',
          paymentMethod: isEnglish ? 'Payment Method' : 'Método de Pago',
          creditCard: isEnglish ? 'Credit/Debit Card' : 'Tarjeta de Crédito/Débito',
          supportMessage: isEnglish 
            ? 'If you have any questions about your order, please contact us at'
            : 'Si tienes alguna pregunta sobre tu pedido, contáctanos en',
          regards: isEnglish ? 'Best regards,' : 'Saludos cordiales,',
          team: isEnglish ? 'DSYNC Team' : 'Equipo DSYNC',
          rights: isEnglish ? 'All rights reserved.' : 'Todos los derechos reservados.',
        }

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
                    <p style="margin: 5px 0;"><strong>${texts.cardLabel}:</strong> **** **** **** ${last4}</p>
                    <p style="margin: 5px 0;"><strong>${texts.transactionLabel}:</strong> ${resultado.transactionId || `TXN-${Date.now()}`}</p>
                  </div>
                  
                  <table class="order-table">
                    <thead>
                      <tr>
                        <th>${texts.productLabel}</th>
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
                        <td style="padding: 15px 12px; text-align: right;"><strong>${texts.totalAmountLabel}</strong></td>
                        <td style="padding: 15px 12px; text-align: right;">${formatPrice(total)} MXN</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div class="customer-info">
                    <h3 style="margin: 0 0 15px 0; color: #111827;">${texts.customerInfo}</h3>
                    <p style="margin: 5px 0;"><strong>${texts.nameLabel}:</strong> ${nombre} ${apellido}</p>
                    <p style="margin: 5px 0;"><strong>${texts.emailLabel}:</strong> ${email}</p>
                    ${direccion ? `<p style="margin: 5px 0;"><strong>${texts.addressLabel}:</strong> ${direccion}, ${poblacion}, ${region}, CP ${codigoPostal}</p>` : ''}
                  </div>
                  
                  <div class="customer-info">
                    <h3 style="margin: 0 0 15px 0; color: #111827;">${texts.paymentMethod}</h3>
                    <p style="margin: 5px 0;">${texts.creditCard}</p>
                    <div class="card-badge">💳 •••• •••• •••• ${last4}</div>
                  </div>
                  
                  <p style="margin-top: 30px; color: #6b7280;">
                    ${texts.supportMessage} <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #111827; font-weight: bold;">${process.env.ADMIN_EMAIL}</a>
                  </p>
                </div>
                
                <div class="footer">
                  <p>${texts.regards}<br><strong>${texts.team}</strong></p>
                  <p style="margin-top: 15px; font-size: 12px;">
                    © ${new Date().getFullYear()} DSYNC. ${texts.rights}
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
          ? `New Order #${orderId} - ${customerName}`
          : `Nuevo Pedido #${orderId} - ${customerName}`

        await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: [process.env.ADMIN_EMAIL],
          subject: adminSubject,
          html: emailContent,
        })

        console.log('📧 Emails de confirmación enviados en', isEnglish ? 'inglés' : 'español')
      } catch (emailError) {
        console.error('⚠️ Error enviando emails:', emailError)
      }
    }

    return NextResponse.json({
      success: resultado.success || resultado.status === 'approved',
      orderId: orderId,
      transactionId: resultado.transactionId || `TXN-${Date.now()}`,
      last4: last4,
      message: resultado.message || (isEnglish ? 'Payment processed' : 'Pago procesado'),
    })

  } catch (error) {
    console.error('❌ [PAGO] Error:', error.message)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}