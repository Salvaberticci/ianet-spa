import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/models/Inventory"
import { inventorySchema } from "@/lib/validations"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || ""
    const status = searchParams.get("status") || ""
    const lowStock = searchParams.get("lowStock") === "true"
    const nearExpiration = searchParams.get("nearExpiration") === "true"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query = {}

    if (type) query.type = type
    if (status) query.status = status
    if (lowStock) query.stock = { $lte: 10 }
    if (nearExpiration) {
      const nextMonth = new Date()
      nextMonth.setDate(nextMonth.getDate() + 30)
      query.expirationDate = { $lte: nextMonth }
    }

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      Inventory.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Inventory.countDocuments(query),
    ])

    return NextResponse.json({
      items,
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
    await requireAuth()
    await dbConnect()

    const body = await request.json()
    const validated = inventorySchema.parse(body)

    const item = await Inventory.create(validated)

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
