import { requireAuth } from "@/lib/auth"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { notFound } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/models/Inventory"
import Link from "next/link"
import { Plus } from "lucide-react"
import InventoryTable from "@/components/inventory-table"

async function getInventory(rawSearchParams) {
  await dbConnect()

  const searchParams = await rawSearchParams

  const type = searchParams?.type || ""
  const status = searchParams?.status || ""
  const lowStock = searchParams?.lowStock === "true"
  const nearExpiration = searchParams?.nearExpiration === "true"
  const page = Number.parseInt(searchParams?.page || "1")
  const limit = 10

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
    Inventory.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Inventory.countDocuments(query),
  ])

  return {
    items: JSON.parse(JSON.stringify(items)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function InventarioPage({ searchParams }) {
  await requireAuth()
  if (!isFeatureEnabled("inventory")) return notFound()
  const resolvedSearchParams = await searchParams
  const { items, pagination } = await getInventory(Promise.resolve(resolvedSearchParams))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
        <Link
          href="/admin/inventario/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Ítem
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <InventoryTable items={items} pagination={pagination} />
      </div>
    </div>
  )
}
