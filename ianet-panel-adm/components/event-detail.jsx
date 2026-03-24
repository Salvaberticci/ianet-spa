"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Plus, X } from "lucide-react"
import Link from "next/link"

export default function EventDetail({ event, staff = [] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState("")
  const [assignedStaff, setAssignedStaff] = useState(event.assignedStaff || [])

  const handleAddStaff = async () => {
    if (!selectedStaff || assignedStaff.find((s) => (s._id || s) === selectedStaff)) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...event,
          assignedStaff: [...assignedStaff.map((s) => s._id || s), selectedStaff],
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setAssignedStaff(updated.assignedStaff || [])
        setSelectedStaff("")
        router.refresh()
      } else {
        alert("Error al agregar personal")
      }
    } catch (error) {
      alert("Error al agregar personal")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStaff = async (staffId) => {
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...event,
          assignedStaff: assignedStaff.filter((s) => (s._id || s) !== staffId).map((s) => s._id || s),
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setAssignedStaff(updated.assignedStaff || [])
        router.refresh()
      } else {
        alert("Error al remover personal")
      }
    } catch (error) {
      alert("Error al remover personal")
    } finally {
      setLoading(false)
    }
  }

  const getStaffName = (staffId) => {
    const s = staff.find((st) => st._id === staffId)
    return s ? `${s.name}${s.roleVisible ? ` - ${s.roleVisible}` : ""}` : "Desconocido"
  }

  const availableStaff = staff.filter((s) => !assignedStaff.find((as) => (as._id || as) === s._id))

  return (
    <div className="space-y-6">
      <Link
        href="/admin/eventos"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la lista
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
          <Link
            href={`/admin/eventos/${event._id}/editar`}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Evento
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <p className="text-gray-900">
              {new Date(event.date).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {event.time && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <p className="text-gray-900">{event.time}</p>
            </div>
          )}

          {event.location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
              <p className="text-gray-900">{event.location}</p>
            </div>
          )}

          {event.responsible && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <p className="text-gray-900">{event.responsible}</p>
            </div>
          )}
        </div>

        {event.description && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Asignado</h3>

          {assignedStaff.length > 0 ? (
            <div className="space-y-2 mb-4">
              {assignedStaff.map((staffMember) => {
                const staffId = staffMember._id || staffMember
                return (
                  <div
                    key={staffId}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                  >
                    <span className="text-gray-900">{getStaffName(staffId)}</span>
                    <button
                      onClick={() => handleRemoveStaff(staffId)}
                      disabled={loading}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remover"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No hay personal asignado a este evento.</p>
          )}

          {availableStaff.length > 0 && (
            <div className="flex gap-2">
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              >
                <option value="">Seleccionar personal...</option>
                {availableStaff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} {s.roleVisible ? `- ${s.roleVisible}` : ""}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStaff}
                disabled={loading || !selectedStaff}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
