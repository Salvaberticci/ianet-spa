import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { userSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function GET(request, { params }) {
  try {
    await requireAdmin()
    await dbConnect()

    const { id } = await params
    const user = await User.findById(id, "-password")

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin()
    await dbConnect()

    const { id } = await params
    const body = await request.json()
    const validated = userSchema.partial().parse(body)

    // Prevenir desactivarse a sí mismo por error (opcional pero recomendado)
    // if (id === session.user.id && validated.active === false) ...

    const updateData = { ...validated }
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 12)
    } else {
      delete updateData.password
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    await dbConnect()

    const { id } = await params
    
    // Evitar que el admin se borre a sí mismo
    // const session = await requireAdmin()
    // if (id === session.user.id) return ...

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Usuario eliminado" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
