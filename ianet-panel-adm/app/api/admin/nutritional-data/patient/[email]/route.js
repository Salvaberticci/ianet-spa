import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import NutritionalData from "@/models/NutritionalData"

export async function GET(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const resolvedParams = await params
    const email = decodeURIComponent(resolvedParams.email)

    const data = await NutritionalData.find({ patientEmail: email })
      .sort({ date: -1 })
      .lean()

    return NextResponse.json(JSON.parse(JSON.stringify(data)))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

