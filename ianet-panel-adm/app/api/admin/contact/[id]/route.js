import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Contact from "@/models/Contact"

export async function GET(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const contact = await Contact.findById(params.id)

    if (!contact) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const { status, internalNotes } = body

    const updateData = {}
    if (status) updateData.status = status
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes

    const contact = await Contact.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!contact) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
