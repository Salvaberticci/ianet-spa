import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import { appointmentSchema } from "@/lib/validations"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validated = appointmentSchema.parse(body)

    const appointment = await Appointment.create({
      ...validated,
      dateTime: new Date(validated.dateTime),
    })

    return NextResponse.json(
      {
        message: "Cita solicitada exitosamente",
        id: appointment._id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error al solicitar la cita" }, { status: 400 })
  }
}
