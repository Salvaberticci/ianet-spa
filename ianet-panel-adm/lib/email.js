import nodemailer from "nodemailer"

/**
 * Configuración del transporte de Nodemailer (SMTP)
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true para el puerto 465, false para otros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Envía un correo de notificación de asignación a un evento
 * @param {Object} staff - Miembro del personal con name y email
 * @param {Object} event - Evento con name, date, time, location, description
 */
export async function sendEventAssignmentEmail({ staff, event }) {
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
