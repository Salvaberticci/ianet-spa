import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Staff from "@/models/Staff"
import { staffSchema } from "@/lib/validations"

export async function GET(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const staff = await Staff.findById(params.id)

    if (!staff) {
      return NextResponse.json({ error: "Personal no encontrado" }, { status: 404 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = staffSchema.parse(body)

    const staff = await Staff.findByIdAndUpdate(params.id, validated, {
      new: true,
      runValidators: true,
    })

    if (!staff) {
      return NextResponse.json({ error: "Personal no encontrado" }, { status: 404 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const staff = await Staff.findByIdAndDelete(params.id)

    if (!staff) {
      return NextResponse.json({ error: "Personal no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Personal eliminado" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
