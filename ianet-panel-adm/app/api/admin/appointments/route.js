import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import { appointmentSchema } from "@/lib/validations"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const date = searchParams.get("date") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query = {}

    if (status) query.status = status
    if (type) query.type = type
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.dateTime = { $gte: startDate, $lt: endDate }
    }

    const skip = (page - 1) * limit

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .sort({ dateTime: 1 })
        .skip(skip)
        .limit(limit)
        .populate("assignedStaff", "name roleVisible"),
      Appointment.countDocuments(query),
    ])

    return NextResponse.json({
      appointments,
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
    const validated = appointmentSchema.parse(body)

    const appointmentDate = new Date(validated.dateTime)

    // Validación 1: No permitir citas en fechas pasadas
    const now = new Date()
    if (appointmentDate < now) {
      return NextResponse.json(
        { error: "No se pueden agendar citas para fechas y horas pasadas." },
        { status: 400 }
      )
    }

    // Validación 2: No permitir dos citas a la misma hora exacta
    const existingAppointment = await Appointment.findOne({
      dateTime: appointmentDate,
      status: { $nin: ["cancelada"] },
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Ya existe una cita agendada para esa fecha y hora. Por favor elige otro horario." },
        { status: 409 }
      )
    }

    const appointmentData = { ...validated, dateTime: appointmentDate }
    // If no staff is selected, remove the empty field to avoid ObjectId cast error
    if (!appointmentData.assignedStaff) delete appointmentData.assignedStaff

    const appointment = await Appointment.create(appointmentData)

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
