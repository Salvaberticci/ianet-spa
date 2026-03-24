import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import { eventSchema } from "@/lib/validations"

export async function GET(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const event = await Event.findById(params.id).populate("assignedStaff", "name email roleVisible")

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
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = eventSchema.parse(body)

    const event = await Event.findByIdAndUpdate(
      params.id,
      {
        ...validated,
        date: new Date(validated.date),
      },
      {
        new: true,
        runValidators: true,
      },
    )

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
    await requireAuth()
    await dbConnect()

    const event = await Event.findByIdAndDelete(params.id)

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Evento eliminado" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
