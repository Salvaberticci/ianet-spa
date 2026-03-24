import { requireAuth } from "@/lib/auth"
import InventoryForm from "@/components/inventory-form"

export default async function NuevoInventarioPage() {
  await requireAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuevo Ítem de Inventario</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <InventoryForm />
      </div>
    </div>
  )
}
