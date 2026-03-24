import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Contact from "@/models/Contact"
import { contactSchema } from "@/lib/validations"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validated = contactSchema.parse(body)

    const contact = await Contact.create(validated)

    return NextResponse.json(
      {
        message: "Mensaje enviado exitosamente",
        id: contact._id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error al enviar el mensaje" }, { status: 400 })
  }
}
