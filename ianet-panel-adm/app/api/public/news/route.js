import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"

export async function GET(request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || ""

    const query = { status: "publicada" }

    if (category) {
      query.category = category
    }

    const skip = (page - 1) * limit

    const [news, total] = await Promise.all([
      News.find(query).sort({ publishDate: -1 }).skip(skip).limit(limit).select("-author -__v"),
      News.countDocuments(query),
    ])

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener noticias" }, { status: 500 })
  }
}
