import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/models/Inventory"
import { inventorySchema } from "@/lib/validations"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const item = await Inventory.findById(id)

    if (!item) {
      return NextResponse.json({ error: "Ítem no encontrado" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = inventorySchema.parse(body)

    const item = await Inventory.findByIdAndUpdate(id, validated, {
      new: true,
      runValidators: true,
    })

    if (!item) {
      return NextResponse.json({ error: "Ítem no encontrado" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await requireAuth()
    await dbConnect()

    const item = await Inventory.findByIdAndDelete(id)

    if (!item) {
      return NextResponse.json({ error: "Ítem no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Ítem eliminado" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
