import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export async function POST(request) {
  try {
    // 1. Verificar autenticación
    await requireAuth()

    // 2. Obtener el archivo del FormData
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // 3. Subir a Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Falta BLOB_READ_WRITE_TOKEN en las variables de entorno.")
      return NextResponse.json({ 
        error: "Servicio de almacenamiento no configurado. Asegúrate de conectar el Blob Store en Vercel." 
      }, { status: 500 })
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Error detallado al subir archivo:", error)
    return NextResponse.json({ 
      error: error.message || "Error al subir el archivo" 
    }, { status: 500 })
  }
}
