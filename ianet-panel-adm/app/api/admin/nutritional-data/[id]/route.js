import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import NutritionalData from "@/models/NutritionalData"
import { nutritionalDataSchema } from "@/lib/validations"

export async function GET(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const resolvedParams = await params
    const data = await NutritionalData.findById(resolvedParams.id).lean()

    if (!data) {
      return NextResponse.json({ error: "Datos nutricionales no encontrados" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(data)))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const resolvedParams = await params
    const body = await request.json()
    const validated = nutritionalDataSchema.parse(body)

    // Calcular IMC si hay peso y altura
    let bmi = null
    if (validated.weight && validated.height && validated.height > 0) {
      const heightInMeters = validated.height / 100
      bmi = validated.weight / (heightInMeters * heightInMeters)
      bmi = Math.round(bmi * 100) / 100 // Redondear a 2 decimales
    }

    const data = await NutritionalData.findByIdAndUpdate(
      resolvedParams.id,
      {
        ...validated,
        date: new Date(validated.date),
        bmi,
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!data) {
      return NextResponse.json({ error: "Datos nutricionales no encontrados" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(data)))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const resolvedParams = await params
    const data = await NutritionalData.findByIdAndDelete(resolvedParams.id)

    if (!data) {
      return NextResponse.json({ error: "Datos nutricionales no encontrados" }, { status: 404 })
    }

    return NextResponse.json({ message: "Datos nutricionales eliminados" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

