import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Event from "@/models/Event"
import NutritionalData from "@/models/NutritionalData"

// Helper: format a label based on period for the charts X-axis
function formatLabel(id, period) {
  if (period === "day") {
    return `${String(id.day).padStart(2, "0")}/${String(id.month).padStart(2, "0")}/${id.year}`
  }
  if (period === "week") {
    return `Sem ${id.week}/${id.year}`
  }
  // Default: month
  return `${id.month}/${id.year}`
}

// Build $group _id based on chosen period
function buildGroupId(dateField, period) {
  const base = {
    year: { [`$year`]: `$${dateField}` },
    month: { [`$month`]: `$${dateField}` },
  }
  if (period === "day") {
    return { ...base, day: { [`$dayOfMonth`]: `$${dateField}` } }
  }
  if (period === "week") {
    return {
      year: { [`$year`]: `$${dateField}` },
      week: { [`$week`]: `$${dateField}` },
    }
  }
  return base // month
}

// Build sort stage based on period
function buildSort(period) {
  if (period === "day") return { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
  if (period === "week") return { "_id.year": 1, "_id.week": 1 }
  return { "_id.year": 1, "_id.month": 1 }
}

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)

    // Check for custom date range
    const startParam = searchParams.get("start")
    const endParam = searchParams.get("end")

    // period: "day" | "week" | "month"  (default: "month")
    const period = ["day", "week", "month"].includes(searchParams.get("period"))
      ? searchParams.get("period")
      : "month"

    const months = Number.parseInt(searchParams.get("months") || "12")
    const now = new Date()
    let startDate
    let endDate = now

    if (startParam && endParam) {
      startDate = new Date(startParam)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(endParam)
      endDate.setHours(23, 59, 59, 999)
    } else {
      startDate = new Date()
      if (period === "day") {
        startDate.setDate(now.getDate() - 30)
      } else if (period === "week") {
        startDate.setDate(now.getDate() - 16 * 7)
      } else {
        startDate.setMonth(now.getMonth() - months)
        startDate.setDate(1)
      }
      startDate.setHours(0, 0, 0, 0)
    }

    const dateMatch = { $gte: startDate, $lte: endDate }

    const apptGroupId = buildGroupId("dateTime", period)
    const apptSort = buildSort(period)

    // Citas aggregation
    const appointments = await Appointment.aggregate([
      { $match: { dateTime: dateMatch } },
      {
        $group: {
          _id: apptGroupId,
          count: { $sum: 1 },
          medical: { $sum: { $cond: [{ $eq: ["$type", "medica"] }, 1, 0] } },
          nutritional: { $sum: { $cond: [{ $eq: ["$type", "nutricional"] }, 1, 0] } },
        },
      },
      { $sort: apptSort },
    ]).exec()

    // Eventos aggregation
    const evtGroupId = buildGroupId("date", period)
    const events = await Event.aggregate([
      { $match: { date: dateMatch } },
      {
        $group: {
          _id: evtGroupId,
          count: { $sum: 1 },
        },
      },
      { $sort: apptSort },
    ]).exec()

    // Nutritional aggregation (always monthly)
    const nutritionalStats = await NutritionalData.aggregate([
      { $match: { date: dateMatch, weight: { $ne: null } } },
      {
        $group: {
          _id: buildGroupId("date", "month"),
          avgWeight: { $avg: "$weight" },
          avgBMI: { $avg: "$bmi" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]).exec()

    const appointmentsByMonth = appointments.map((item) => ({
      mes: formatLabel(item._id, period),
      total: item.count,
      medica: item.medical,
      nutricional: item.nutritional,
    }))

    const eventsByMonth = events.map((item) => ({
      mes: formatLabel(item._id, period),
      total: item.count,
    }))

    const nutritionalByMonth = nutritionalStats.map((item) => ({
      mes: formatLabel(item._id, "month"),
      pesoPromedio: item.avgWeight ? Math.round(item.avgWeight * 100) / 100 : null,
      imcPromedio: item.avgBMI ? Math.round(item.avgBMI * 100) / 100 : null,
      registros: item.count,
    }))

    return NextResponse.json({
      appointmentsByMonth,
      eventsByMonth,
      nutritionalByMonth,
      period,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
