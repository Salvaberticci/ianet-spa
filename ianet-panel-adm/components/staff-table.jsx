"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function StaffTable({ staff, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(searchParams.get("active") || "")

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (active !== "") params.set("active", active)
    router.push(`/admin/personal?${params.toString()}`)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar a "${name}" del personal?`)) return

    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success(`Personal eliminado`, {
          description: `"${name}" ha sido eliminado del sistema.`,
          icon: "👤",
        })
        router.refresh()
      } else {
        toast.error("No se pudo eliminar el personal.", { icon: "❌" })
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.", { icon: "⚠️" })
    }
  }

  return (
    <div>
      <form onSubmit={handleFilter} className="mb-6 flex gap-4">
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Teléfono</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((person) => (
              <tr key={person._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{person.name}</td>
                <td className="py-3 px-4 text-gray-600">{person.email}</td>
                <td className="py-3 px-4 text-gray-600">{person.phone || "-"}</td>
                <td className="py-3 px-4 text-gray-600">{person.roleVisible || "-"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${person.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {person.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/personal/${person._id}/editar`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(person._id, person.name)}
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
              href={`/admin/personal?page=${page}${active !== "" ? `&active=${active}` : ""}`}
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
