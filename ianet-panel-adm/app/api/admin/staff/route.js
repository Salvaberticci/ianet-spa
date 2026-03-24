import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Staff from "@/models/Staff"
import { staffSchema } from "@/lib/validations"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query = {}

    if (active !== null && active !== "") {
      query.active = active === "true"
    }

    const skip = (page - 1) * limit

    const [staff, total] = await Promise.all([
      Staff.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Staff.countDocuments(query),
    ])

    return NextResponse.json({
      staff,
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
    const validated = staffSchema.parse(body)

    const staff = await Staff.create(validated)

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
