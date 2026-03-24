import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"
import { newsSchema } from "@/lib/validations"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { summary: { $regex: search, $options: "i" } }]
    }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const [news, total] = await Promise.all([
      News.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author", "name email"),
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = newsSchema.parse(body)

    const news = await News.create({
      ...validated,
      author: session.user.id,
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
