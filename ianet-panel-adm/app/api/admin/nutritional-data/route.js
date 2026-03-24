import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import NutritionalData from "@/models/NutritionalData"
import { nutritionalDataSchema } from "@/lib/validations"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const patientEmail = searchParams.get("patientEmail") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query = {}

    if (patientEmail) {
      query.patientEmail = decodeURIComponent(patientEmail)
    }

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      NutritionalData.find(query).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      NutritionalData.countDocuments(query),
    ])

    return NextResponse.json({
      data: JSON.parse(JSON.stringify(data)),
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
    const validated = nutritionalDataSchema.parse(body)

    // Calcular IMC si hay peso y altura
    let bmi = null
    if (validated.weight && validated.height && validated.height > 0) {
      const heightInMeters = validated.height / 100
      bmi = validated.weight / (heightInMeters * heightInMeters)
      bmi = Math.round(bmi * 100) / 100 // Redondear a 2 decimales
    }

    const nutritionalData = await NutritionalData.create({
      ...validated,
      date: new Date(validated.date),
      bmi,
    })

    return NextResponse.json(JSON.parse(JSON.stringify(nutritionalData)), { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

