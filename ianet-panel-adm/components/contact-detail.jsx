"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ContactDetail({ contact }) {
  const router = useRouter()
  const [status, setStatus] = useState(contact.status)
  const [internalNotes, setInternalNotes] = useState(contact.internalNotes || "")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/contact/${contact._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes }),
      })

      if (res.ok) {
        alert("Mensaje actualizado exitosamente")
        router.refresh()
      } else {
        alert("Error al actualizar el mensaje")
      }
    } catch (error) {
      alert("Error al actualizar el mensaje")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/contacto"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la lista
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <p className="text-gray-900">{contact.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{contact.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <p className="text-gray-900">{contact.phone || "No proporcionado"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <p className="text-gray-900">{new Date(contact.createdAt).toLocaleString("es-ES")}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
          <p className="text-gray-900 font-medium">{contact.subject}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gestión Interna</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="nuevo">Nuevo</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
              </select>
            </div>

            <div>
              <label htmlFor="internalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas Internas
              </label>
              <textarea
                id="internalNotes"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Agregar notas internas sobre este mensaje..."
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
