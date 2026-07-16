import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, company, phone, email, service, message, language } = body

    // Validaciones del lado del servidor
    if (!name || !email || !message) {
      const errorMsg = language === 'en' 
        ? 'Name, email and message fields are required'
        : 'Los campos nombre, email y mensaje son requeridos'
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMsg = language === 'en'
        ? 'Email format is not valid'
        : 'El formato del email no es válido'
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      )
    }

    // Determinar idioma (por defecto español)
    const lang = language || 'es'
    const isEnglish = lang === 'en'

    // Inicializar Resend con la API key del entorno
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Textos según idioma
    const texts = {
      adminSubject: isEnglish 
        ? `New Contact from ${name} - DSYNC Website`
        : `Nuevo contacto de ${name} - DSYNC Website`,
      adminTitle: isEnglish ? 'New Contact - DSYNC' : 'Nuevo Contacto - DSYNC',
      adminSubtitle: isEnglish ? 'Website contact form' : 'Formulario de contacto web',
      labelName: isEnglish ? 'Name:' : 'Nombre:',
      labelCompany: isEnglish ? 'Company:' : 'Empresa:',
      labelPhone: isEnglish ? 'Phone:' : 'Teléfono:',
      labelEmail: isEnglish ? 'Email:' : 'Email:',
      labelService: isEnglish ? 'Required Service:' : 'Servicio requerido:',
      labelMessage: isEnglish ? 'Message:' : 'Mensaje:',
      
      // Confirmación al usuario
      userSubject: isEnglish 
        ? 'We have received your message - DSYNC'
        : 'Hemos recibido tu mensaje - DSYNC',
      userTitle: isEnglish ? 'Thank you for contacting us!' : '¡Gracias por contactarnos!',
      userGreeting: isEnglish ? `Hello ${name},` : `Hola ${name},`,
      userMessage: isEnglish
        ? 'We have received your message successfully. Our team will contact you shortly.'
        : 'Hemos recibido tu mensaje correctamente. Nuestro equipo se pondrá en contacto contigo a la brevedad posible.',
      userVisitSite: isEnglish
        ? 'In the meantime, you can visit our website to learn more about our services.'
        : 'Mientras tanto, puedes visitar nuestro sitio web para conocer más sobre nuestros servicios.',
      userSalutation: isEnglish
        ? 'Best regards,'
        : 'Saludos cordiales,',
      userTeam: isEnglish ? 'DSYNC Team' : 'Equipo DSYNC',
    }

    // Construir el contenido del email para el administrador
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #111827; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #111827; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
            .message-box { background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb; margin-top: 5px; }
            .language-badge { display: inline-block; background: #e5e7eb; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">${texts.adminTitle}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">${texts.adminSubtitle}</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">${texts.labelName}</div>
                <div class="value">${name}</div>
              </div>
              
              ${company ? `
              <div class="field">
                <div class="label">${texts.labelCompany}</div>
                <div class="value">${company}</div>
              </div>
              ` : ''}
              
              ${phone ? `
              <div class="field">
                <div class="label">${texts.labelPhone}</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">${texts.labelEmail}</div>
                <div class="value">${email}</div>
              </div>
              
              ${service ? `
              <div class="field">
                <div class="label">${texts.labelService}</div>
                <div class="value">${service}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">${texts.labelMessage}</div>
                <div class="message-box">${message}</div>
              </div>
              
              <div class="language-badge">
                ${isEnglish ? '🌐 Sent in English' : '🌐 Enviado en Español'}
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Enviar email al administrador
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [process.env.ADMIN_EMAIL],
      subject: texts.adminSubject,
      html: adminEmailContent,
      reply_to: email,
    })

    if (error) {
      console.error('Error al enviar email:', error)
      const errorMsg = isEnglish
        ? 'Error sending message'
        : 'Error al enviar el mensaje'
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      )
    }

    // Construir email de confirmación para el usuario
    const userEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #111827; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #111827; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">${texts.userTitle}</h1>
            </div>
            <div class="content">
              <p>${texts.userGreeting}</p>
              <p>${texts.userMessage}</p>
              <p>${texts.userVisitSite}</p>
              <p>${texts.userSalutation}<br><strong>${texts.userTeam}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `

    // Enviar email de confirmación al usuario
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: texts.userSubject,
      html: userEmailContent,
    })

    const successMsg = isEnglish
      ? 'Message sent successfully'
      : 'Mensaje enviado correctamente'

    return NextResponse.json(
      { message: successMsg },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en el servidor:', error)
    const errorMsg = 'Error interno del servidor'
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}