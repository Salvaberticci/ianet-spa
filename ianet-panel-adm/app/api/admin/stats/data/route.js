import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Event from "@/models/Event"
import Inventory from "@/models/Inventory"
import Contact from "@/models/Contact"
import NutritionalData from "@/models/NutritionalData"
import Staff from "@/models/Staff"

function buildDateRange(searchParams) {
    const startParam = searchParams.get("start")
    const endParam = searchParams.get("end")
    const period = searchParams.get("period") || "month"
    const now = new Date()

    if (startParam && endParam) {
        const start = new Date(startParam)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endParam)
        end.setHours(23, 59, 59, 999)
        return { start, end }
    }

    const start = new Date()
    if (period === "day") {
        start.setHours(0, 0, 0, 0)
        const endDay = new Date()
        endDay.setHours(23, 59, 59, 999)
        return { start, end: endDay }
    } else if (period === "week") {
        start.setDate(now.getDate() - 7)
        start.setHours(0, 0, 0, 0)
    } else {
        // Month: Last 30 days
        start.setDate(now.getDate() - 30)
        start.setHours(0, 0, 0, 0)
    }
    return { start, end: now }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        }
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const { start, end } = buildDateRange(searchParams)
        const dateRange = { $gte: start, $lte: end }

        const [appointments, events, inventory, contacts, nutritionalData] = await Promise.all([
            Appointment.find({ dateTime: dateRange }).populate("assignedStaff").sort({ dateTime: -1 }).lean(),
            Event.find({ date: dateRange }).populate("assignedStaff").sort({ date: -1 }).lean(),
            Inventory.find().lean(),
            Contact.find().sort({ createdAt: -1 }).lean(),
            NutritionalData.find({ date: dateRange }).sort({ date: -1 }).lean(),
        ])

        const stats = {
            totalAppointments: appointments.length,
            medicalAppointments: appointments.filter((a) => a.type === "medica").length,
            nutritionalAppointments: appointments.filter((a) => a.type === "nutricional").length,
            totalEvents: events.length,
            totalInventory: inventory.length,
            totalContacts: contacts.length,
            totalNutritionalRecords: nutritionalData.length,
        }

        return NextResponse.json({
            stats,
            appointments,
            events,
        })
    } catch (error) {
        console.error("[stats/data] Error:", error.message, error.stack)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
