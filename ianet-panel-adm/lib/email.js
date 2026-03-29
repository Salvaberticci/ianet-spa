import nodemailer from "nodemailer"

/**
 * Envía un correo de notificación de asignación a un evento
 * @param {Object} staff - Miembro del personal con name y email
 * @param {Object} event - Evento con name, date, time, location, description
 */
export async function sendEventAssignmentEmail({ staff, event }) {
  // 1. Verificar configuración básica antes de crear el transporte
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Nodemailer no configurado: faltan variables SMTP. Saltando envío de correo.")
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  if (!staff.email) {
    console.error(`No se puede enviar correo a ${staff.name}: falta el email.`)
    return
  }

  const dateStr = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "IANET Sistema"}" <${process.env.SMTP_USER}>`,
    to: staff.email,
    subject: `📅 Notificación de Asignación: ${event.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">IANET Sistema</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #10b981;">Hola, ${staff.name}!</h2>
          <p>Has sido asignado para participar en el siguiente evento:</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Evento:</strong> ${event.name}</p>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${dateStr}</p>
            ${event.time ? `<p style="margin: 5px 0;"><strong>Hora:</strong> ${event.time}</p>` : ""}
            ${event.location ? `<p style="margin: 5px 0;"><strong>Lugar:</strong> ${event.location}</p>` : ""}
            ${event.description ? `<p style="margin: 20px 0 5px 0;"><strong>Descripción:</strong></p><p style="margin: 0; color: #666;">${event.description}</p>` : ""}
          </div>
          
          <p>Por favor, revisa los detalles en el Panel Administrativo para cualquier información adicional.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; pt-20px; text-align: center; font-size: 12px; color: #999;">
            <p>Este es un mensaje automático generado por el sistema IANET.</p>
          </div>
        </div>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Correo enviado exitosamente a ${staff.email}: ${info.messageId}`)
    return info
  } catch (error) {
    console.error(`Error al enviar correo a ${staff.email}:`, error)
    // No lanzamos el error para no bloquear el flujo principal de la aplicación
  }
}

/**
 * Envía una notificación a la institución cuando se solicita una nueva cita
 * @param {string} institutionalEmail - Correo de la institución
 * @param {Object} appointment - Nueva cita con patientName, patientEmail, patientPhone, type, dateTime, notes
 */
export async function sendAppointmentNotificationEmail({ institutionalEmail, appointment }) {
  console.log(`[DIAGNÓSTICO EMAIL] Destinatario: ${institutionalEmail}`)
  console.log(`[DIAGNÓSTICO SMTP] User: ${process.env.SMTP_USER || "VACÍO"}, Host: ${process.env.SMTP_HOST || "VACÍO"}`)
  
  // 1. Verificar configuración SMTP
  const smtpConfig = {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? "PRESENT" : "MISSING",
    port: process.env.SMTP_PORT,
    fromName: process.env.SMTP_FROM_NAME
  }
  
  if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass || !institutionalEmail) {
    console.warn("[EMAIL] Error Crítico: Faltan parámetros para el envío del correo.", smtpConfig)
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const typeLabels = {
    "atencion-ciudadano": "Atención al Ciudadano",
    "valoracion-nutricional": "Valoración Nutricional",
  }

  const dateStr = new Date(appointment.dateTime).toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "IANET Sistema"}" <${process.env.SMTP_USER}>`,
    to: institutionalEmail,
    subject: `🆕 Nueva Solicitud de Cita: ${appointment.patientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #10b981; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">IANET Sistema</h1>
          <p style="color: #ffffff; margin: 5px 0 0 0;">Nueva Solicitud de Cita</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #10b981; border-bottom: 2px solid #f0fdf4; padding-bottom: 10px;">Detalles de la Cita</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Paciente:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointment.patientName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Tipo de Servicio:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${typeLabels[appointment.type] || appointment.type}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Fecha y Hora:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Correo:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointment.patientEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${appointment.patientPhone}</td>
            </tr>
          </table>

          ${appointment.notes ? `
          <div style="margin-top: 20px; background-color: #f9fafb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0 0 5px 0;"><strong>Notas adicionales:</strong></p>
            <p style="margin: 0; color: #666;">${appointment.notes}</p>
          </div>
          ` : ""}
          
          <div style="margin-top: 30px; text-align: center;">
            <p>Por favor, ingresa al Panel Administrativo para confirmar esta cita.</p>
          </div>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; pt-20px; text-align: center; font-size: 12px; color: #999;">
            <p>Este es un mensaje automático generado por el sistema IANET.</p>
          </div>
        </div>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`[EMAIL] Notificación enviada con éxito a ${institutionalEmail}. ID: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`[EMAIL] Error fatal al enviar notificación a ${institutionalEmail}:`, error.message)
    return { success: false, error: error.message, code: error.code }
  }
}
