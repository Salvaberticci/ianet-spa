import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"

export async function GET(request, { params }) {
  try {
    await dbConnect()

    const { id } = params

    const news = await News.findOne({ 
      _id: id, 
      status: "publicada" 
    }).select("-author -__v")

    if (!news) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la noticia" }, { status: 500 })
  }
}


