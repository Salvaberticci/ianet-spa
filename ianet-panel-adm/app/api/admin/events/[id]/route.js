import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Staff from "@/models/Staff"
import { eventSchema } from "@/lib/validations"
import { sendEventAssignmentEmail } from "@/lib/email"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const event = await Event.findById(id).populate("assignedStaff", "name email roleVisible")

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = eventSchema.parse(body)

    // 1. Obtener el evento actual para comparar asignados
    const oldEvent = await Event.findById(id)
    if (!oldEvent) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        ...validated,
        date: new Date(validated.date),
      },
      {
        new: true,
        runValidators: true,
      },
    )

    // 2. Notificar a los NUEVOS miembros del personal asignado (en segundo plano)
    if (event.assignedStaff && event.assignedStaff.length > 0) {
      const oldStaffIds = (oldEvent.assignedStaff || []).map((id) => id.toString())
      const newStaffIds = event.assignedStaff.filter((id) => !oldStaffIds.includes(id.toString()))

      if (newStaffIds.length > 0) {
        Staff.find({ _id: { $in: newStaffIds }, active: true })
          .then((staffMembers) => {
            staffMembers.forEach((staff) => {
              sendEventAssignmentEmail({ staff, event }).catch(console.error)
            })
          })
          .catch(console.error)
      }
    }

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const event = await Event.findByIdAndDelete(id)

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Evento eliminado" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
