import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Setting from "@/models/Setting"

export async function GET() {
  try {
    await requireAuth()
    await dbConnect()

    const settings = await Setting.find()
    const config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await requireAuth()
    await dbConnect()

    const body = await request.json()

    const promises = Object.entries(body).map(([key, value]) => {
      return Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      )
    })

    await Promise.all(promises)

    return NextResponse.json({ message: "Configuración actualizada exitosamente" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
