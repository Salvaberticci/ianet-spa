import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Setting from "@/models/Setting"
import { appointmentSchema } from "@/lib/validations"
import { sendAppointmentNotificationEmail } from "@/lib/email"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validated = appointmentSchema.parse(body)
    const appointmentDate = new Date(validated.dateTime)

    // ── VALIDACIÓN DE HORARIO ────────────────────────────────────────────────
    // Lunes = 1, Martes = 2
    const day = appointmentDate.getDay()
    const hour = appointmentDate.getHours()
    const minutes = appointmentDate.getMinutes()

    if (day !== 1 && day !== 2) {
      return NextResponse.json(
        { error: "Las citas solo se pueden agendar los días Lunes y Martes." },
        { status: 400 }
      )
    }

    // Horario: 8:30 AM a 2:00 PM (14:00)
    const minutesSinceMidnight = hour * 60 + minutes
    const startLimit = 8 * 60 + 30 // 08:30
    const endLimit = 14 * 60 // 14:00

    if (minutesSinceMidnight < startLimit || minutesSinceMidnight >= endLimit) {
      return NextResponse.json(
        { error: "El horario de atención es de 8:30 AM a 2:00 PM." },
        { status: 400 }
      )
    }
    // ─────────────────────────────────────────────────────────────────────────

    const appointment = await Appointment.create({
      ...validated,
      dateTime: appointmentDate,
    })

    let mailStatus = { sent: false, error: "No configurado" }
    // ── NOTIFICACIÓN POR EMAIL ───────────────────────────────────────────────
    try {
      const settings = await Setting.findOne({ key: "institutionalEmail" })
      if (settings?.value) {
        console.log(`[API] Se encontró email institucional: ${settings.value}. Disparando aviso...`)
        
        const result = await sendAppointmentNotificationEmail({
          institutionalEmail: settings.value,
          appointment: appointment.toObject(),
        })
        mailStatus = { sent: result?.success || false, info: result }
      } else {
        mailStatus = { sent: false, error: "Settings not found" }
      }
    } catch (emailErr) {
      mailStatus = { sent: false, error: emailErr.message }
    }
    // ─────────────────────────────────────────────────────────────────────────

    return NextResponse.json(
      {
        message: "Cita solicitada exitosamente",
        id: appointment._id,
        mailStatus, // Esto se verá en la consola del navegador del desarrollador
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error al solicitar la cita" }, { status: 400 })
  }
}
