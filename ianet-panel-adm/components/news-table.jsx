"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

export default function NewsTable({ news, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    router.push(`/admin/noticias?${params.toString()}`)
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar la noticia "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success(`Noticia eliminada`, {
          description: `"${title}" ha sido eliminada.`,
          icon: "🗑️",
        })
        router.refresh()
      } else {
        toast.error("No se pudo eliminar la noticia.", { icon: "❌" })
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.", { icon: "⚠️" })
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por título o resumen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los estados</option>
          <option value="borrador">Borrador</option>
          <option value="publicada">Publicada</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          Buscar
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600 truncate max-w-md">{item.summary}</div>
                </td>
                <td className="py-3 px-4 text-gray-600">{item.category || "-"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "publicada" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 text-sm">
                  {new Date(item.publishDate).toLocaleDateString("es-ES")}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/noticias/${item._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/noticias/${item._id}/editar`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
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
              href={`/admin/noticias?page=${page}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
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
