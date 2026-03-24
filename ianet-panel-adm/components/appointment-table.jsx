"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

export default function AppointmentTable({ appointments, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [date, setDate] = useState(searchParams.get("date") || "")
  const [deletingId, setDeletingId] = useState(null)   // ID being confirmed for deletion
  const [loadingId, setLoadingId] = useState(null)     // ID of a delete in progress

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    if (type) params.set("type", type)
    if (date) params.set("date", date)
    router.push(`/admin/citas?${params.toString()}`)
  }

  const handleDeleteConfirmed = async (id, patientName) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setDeletingId(null)
        toast.success(`Cita eliminada`, {
          description: patientName ? `La cita de ${patientName} fue eliminada.` : "La cita fue eliminada correctamente.",
          icon: "🗑️",
        })
        router.refresh()
      } else {
        toast.error("No se pudo eliminar la cita.", { icon: "❌" })
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.", { icon: "⚠️" })
    } finally {
      setLoadingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "solicitada":
        return "bg-blue-100 text-blue-700"
      case "confirmada":
        return "bg-green-100 text-green-700"
      case "atendida":
        return "bg-gray-100 text-gray-700"
      case "cancelada":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div>
      {/* Inline Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar cita?</h3>
            <p className="text-gray-500 mb-6 text-sm">Esta acción no se puede deshacer. La cita será eliminada permanentemente.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirmed(deletingId)}
                disabled={loadingId === deletingId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-60"
              >
                {loadingId === deletingId ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleFilter} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los estados</option>
          <option value="solicitada">Solicitada</option>
          <option value="confirmada">Confirmada</option>
          <option value="atendida">Atendida</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los tipos</option>
          <option value="medica">Médica</option>
          <option value="nutricional">Nutricional</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />

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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Paciente</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Personal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-800">{appointment.patientName}</div>
                  <div className="text-sm text-gray-600">{appointment.patientEmail}</div>
                </td>
                <td className="py-3 px-4 text-gray-600 capitalize">{appointment.type}</td>
                <td className="py-3 px-4 text-gray-600 text-sm">
                  {new Date(appointment.dateTime).toLocaleString("es-ES")}
                </td>
                <td className="py-3 px-4 text-gray-600">{appointment.assignedStaff?.name || "Sin asignar"}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/citas/${appointment._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/citas/${appointment._id}/editar`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeletingId(appointment._id)}
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
              href={`/admin/citas?page=${page}${status ? `&status=${status}` : ""}${type ? `&type=${type}` : ""}${date ? `&date=${date}` : ""}`}
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
