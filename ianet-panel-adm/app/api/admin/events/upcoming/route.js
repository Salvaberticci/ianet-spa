import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Staff from "@/models/Staff"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sevenDaysLater = new Date()
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
    sevenDaysLater.setHours(23, 59, 59, 999)

    const upcomingEvents = await Event.find({
      date: {
        $gte: today,
        $lte: sevenDaysLater,
      },
    })
      .sort({ date: 1 })
      .populate("assignedStaff", "name roleVisible")
      .lean()

    return NextResponse.json({ events: upcomingEvents })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
