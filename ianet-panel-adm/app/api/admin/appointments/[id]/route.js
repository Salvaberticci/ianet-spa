import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const appointment = await Appointment.findById(id).populate("assignedStaff", "name email roleVisible")

    if (!appointment) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const body = await request.json()

    // Validaciones si se está actualizando la fecha
    if (body.dateTime) {
      const appointmentDate = new Date(body.dateTime)
      const now = new Date()

      // Validación 1: No permitir citas en fechas pasadas
      if (appointmentDate < now) {
        return NextResponse.json(
          { error: "No se pueden agendar citas para fechas y horas pasadas." },
          { status: 400 }
        )
      }

      // Validación 2: No permitir dos citas a la misma hora (excluyendo la cita actual)
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: id },
        dateTime: appointmentDate,
        status: { $nin: ["cancelada"] },
      })

      if (existingAppointment) {
        return NextResponse.json(
          { error: "Ya existe una cita agendada para esa fecha y hora. Por favor elige otro horario." },
          { status: 409 }
        )
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!appointment) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const appointment = await Appointment.findByIdAndDelete(id)

    if (!appointment) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cita eliminada" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
