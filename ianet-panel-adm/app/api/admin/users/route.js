import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { userSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    await requireAdmin()
    await dbConnect()

    // Buscamos todos los usuarios excepto sus contraseñas
    const users = await User.find({}, "-password").sort({ createdAt: -1 })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: error.message || "No autorizado" }, { status: error.message === "Acceso denegado" ? 403 : 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()
    await dbConnect()

    const body = await request.json()
    const validated = userSchema.parse(body)

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: validated.email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está en uso" }, { status: 400 })
    }

    if (!validated.password) {
      return NextResponse.json({ error: "La contraseña es requerida para nuevos usuarios" }, { status: 400 })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(validated.password, 12)

    const user = await User.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      password: hashedPassword,
      role: validated.role,
      active: validated.active !== undefined ? validated.active : true,
    })

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
