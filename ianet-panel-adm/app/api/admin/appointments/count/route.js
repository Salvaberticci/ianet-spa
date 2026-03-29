import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"

export async function GET() {
  try {
    await requireAuth()
    await dbConnect()

    // Contamos solo las citas que están en estado "solicitada" (nuevas)
    const count = await Appointment.countDocuments({ status: "solicitada" })

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
