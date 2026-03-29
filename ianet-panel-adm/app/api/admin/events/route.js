import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Staff from "@/models/Staff"
import { eventSchema } from "@/lib/validations"
import { sendEventAssignmentEmail } from "@/lib/email"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const [events, total] = await Promise.all([
      Event.find().sort({ date: -1 }).skip(skip).limit(limit).populate("assignedStaff", "name roleVisible"),
      Event.countDocuments(),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = eventSchema.parse(body)

    const event = await Event.create({
      ...validated,
      date: new Date(validated.date),
    })

    // 4. Enviar notificaciones al personal asignado (en bloque de seguridad)
    try {
      if (event.assignedStaff && event.assignedStaff.length > 0) {
        // Obtenemos los miembros para tener sus correos
        const staffMembers = await Staff.find({ _id: { $in: event.assignedStaff }, active: true })
        
        // Enviamos las promesas de correo (sin bloquear la respuesta crítica si no queremos)
        // Pero en Serverless es mejor esperar o usar un manejador de fondo robusto
        // Aquí esperamos a que se procesen las llamadas para evitar que Vercel mate el proceso
        await Promise.allSettled(
          staffMembers.map(staff => sendEventAssignmentEmail({ staff, event }))
        )
      }
    } catch (mailError) {
      console.error("Error crítico en el flujo de notificación de correos:", mailError)
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
