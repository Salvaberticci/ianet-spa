import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"
import { newsSchema } from "@/lib/validations"

export async function GET(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const news = await News.findById(params.id).populate("author", "name email")

    if (!news) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = newsSchema.parse(body)

    const news = await News.findByIdAndUpdate(params.id, validated, {
      new: true,
      runValidators: true,
    })

    if (!news) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth()
    await dbConnect()

    const news = await News.findByIdAndDelete(params.id)

    if (!news) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Noticia eliminada" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
