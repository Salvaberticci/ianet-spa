"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Eye } from "lucide-react"

export default function EventTable({ events, pagination }) {
  const router = useRouter()

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Error al eliminar el evento")
      }
    } catch (error) {
      alert("Error al eliminar el evento")
    }
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Lugar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Responsable</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Personal Asignado</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-800">{event.name}</div>
                  {event.description && (
                    <div className="text-sm text-gray-600 truncate max-w-md">{event.description}</div>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  <div>{new Date(event.date).toLocaleDateString("es-ES")}</div>
                  {event.time && <div className="text-sm text-gray-500">{event.time}</div>}
                </td>
                <td className="py-3 px-4 text-gray-600">{event.location || "-"}</td>
                <td className="py-3 px-4 text-gray-600">{event.responsible || "-"}</td>
                <td className="py-3 px-4 text-gray-600">{event.assignedStaff?.length || 0} personas</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/eventos/${event._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/eventos/${event._id}/editar`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
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
              href={`/admin/eventos?page=${page}`}
              className={`px-4 py-2 rounded-lg ${
                page === pagination.page ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
