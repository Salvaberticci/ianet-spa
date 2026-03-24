"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function InventoryTable({ items, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [type, setType] = useState(searchParams.get("type") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [lowStock, setLowStock] = useState(searchParams.get("lowStock") === "true")
  const [nearExpiration, setNearExpiration] = useState(searchParams.get("nearExpiration") === "true")

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (status) params.set("status", status)
    if (lowStock) params.set("lowStock", "true")
    if (nearExpiration) params.set("nearExpiration", "true")
    router.push(`/admin/inventario?${params.toString()}`)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}" del inventario?`)) return

    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success(`Producto eliminado del inventario`, {
          description: `"${name}" ha sido eliminado.`,
          icon: "🗑️",
        })
        router.refresh()
      } else {
        toast.error("No se pudo eliminar el producto.", { icon: "❌" })
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.", { icon: "⚠️" })
    }
  }

  const isLowStock = (stock) => stock <= 10

  const getExpirationStatus = (date) => {
    if (!date) return null
    const now = new Date()
    const exp = new Date(date)
    const diffTime = exp - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return "expired"
    if (diffDays <= 30) return "near"
    return "ok"
  }

  return (
    <div>
      <form onSubmit={handleFilter} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los tipos</option>
          <option value="medicina">Medicina</option>
          <option value="alimento">Alimento</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl cursor-pointer">
          <input type="checkbox" checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} />
          <span className="text-sm text-gray-700">Stock bajo</span>
        </label>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl cursor-pointer">
          <input type="checkbox" checked={nearExpiration} onChange={(e) => setNearExpiration(e.target.checked)} />
          <span className="text-sm text-gray-700">Próximos a vencer</span>
        </label>

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidad</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Vencimiento</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {isLowStock(item.stock) && <AlertTriangle className="w-4 h-4 text-orange-500" title="Stock bajo" />}
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 capitalize">{item.type}</td>
                <td className="py-3 px-4">
                  <span className={`font-semibold ${isLowStock(item.stock) ? "text-orange-600" : "text-gray-800"}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{item.unit}</td>
                <td className="py-3 px-4 text-gray-600">
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-sm ${getExpirationStatus(item.expirationDate) === "expired" ? "text-red-600 font-bold" :
                      getExpirationStatus(item.expirationDate) === "near" ? "text-orange-600 font-medium" : ""
                      }`}>
                      {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString("es-ES") : "-"}
                    </span>
                    {getExpirationStatus(item.expirationDate) === "expired" && (
                      <span className="text-[10px] text-red-500 font-bold uppercase">Vencido</span>
                    )}
                    {getExpirationStatus(item.expirationDate) === "near" && (
                      <span className="text-[10px] text-orange-500 font-bold uppercase">Por vencer</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/inventario/${item._id}/editar`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/admin/inventario?page=${page}${type ? `&type=${type}` : ""}${status ? `&status=${status}` : ""}${lowStock ? "&lowStock=true" : ""}${nearExpiration ? "&nearExpiration=true" : ""}`}
              className={`px-4 py-2 rounded-lg ${page === pagination.page ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
