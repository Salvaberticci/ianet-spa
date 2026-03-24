import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Inventory from "@/models/Inventory"
import InventoryForm from "@/components/inventory-form"
import { notFound } from "next/navigation"

async function getInventoryItem(id) {
  await dbConnect()
  const item = await Inventory.findById(id).lean()
  if (!item) return null
  return JSON.parse(JSON.stringify(item))
}

export default async function EditarInventarioPage({ params }) {
  await requireAuth()
  const item = await getInventoryItem(params.id)

  if (!item) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Ítem de Inventario</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <InventoryForm initialData={item} />
      </div>
    </div>
  )
}
