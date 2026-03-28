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
    // El token BLOB_READ_WRITE_TOKEN debe estar en las variables de entorno
    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ error: error.message || "Error al subir el archivo" }, { status: 500 })
  }
}
