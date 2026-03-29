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

    // 4. Enviar notificaciones al personal asignado (en segundo plano)
    if (event.assignedStaff && event.assignedStaff.length > 0) {
      Staff.find({ _id: { $in: event.assignedStaff }, active: true })
        .then((staffMembers) => {
          staffMembers.forEach((staff) => {
            sendEventAssignmentEmail({ staff, event }).catch(console.error)
          })
        })
        .catch(console.error)
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
