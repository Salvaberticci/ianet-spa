"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye } from "lucide-react"

export default function ContactTable({ contacts, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState(searchParams.get("status") || "")

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    router.push(`/admin/contacto?${params.toString()}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "nuevo":
        return "bg-blue-100 text-blue-700"
      case "en_proceso":
        return "bg-yellow-100 text-yellow-700"
      case "resuelto":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "nuevo":
        return "Nuevo"
      case "en_proceso":
        return "En Proceso"
      case "resuelto":
        return "Resuelto"
      default:
        return status
    }
  }

  return (
    <div>
      <form onSubmit={handleFilter} className="mb-6 flex gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Asunto</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{contact.name}</td>
                <td className="py-3 px-4 text-gray-600">{contact.email}</td>
                <td className="py-3 px-4 text-gray-600">{contact.subject}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                    {getStatusLabel(contact.status)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm">
                  {new Date(contact.createdAt).toLocaleDateString("es-ES")}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/admin/contacto/${contact._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
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
              href={`/admin/contacto?page=${page}${status ? `&status=${status}` : ""}`}
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
