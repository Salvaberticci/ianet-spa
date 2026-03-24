"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function EventForm({ initialData = null, staff = [] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    responsible: initialData?.responsible || "",
    assignedStaff: initialData?.assignedStaff?.map((s) => s._id || s) || [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStaffChange = (e) => {
    const options = Array.from(e.target.selectedOptions)
    const selected = options.map((option) => option.value)
    setFormData((prev) => ({ ...prev, assignedStaff: selected }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/admin/events/${initialData._id}` : "/api/admin/events"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const label = initialData ? "actualizado" : "creado"
        toast.success(`Evento ${label} exitosamente`, {
          description: `"${formData.name}" ha sido ${label}.`,
          icon: "🎉",
        })
        setTimeout(() => {
          router.push("/admin/eventos")
          router.refresh()
        }, 500)
      } else {
        const data = await res.json()
        const msg = data.error || "Error al guardar el evento"
        toast.error(msg, { icon: "❌" })
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.", { icon: "⚠️" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Evento *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Hora
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Lugar
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="responsible" className="block text-sm font-medium text-gray-700 mb-2">
            Responsable
          </label>
          <input
            id="responsible"
            name="responsible"
            type="text"
            value={formData.responsible}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="assignedStaff" className="block text-sm font-medium text-gray-700 mb-2">
          Personal Asignado (mantén Ctrl/Cmd para seleccionar múltiples)
        </label>
        <select
          id="assignedStaff"
          multiple
          value={formData.assignedStaff}
          onChange={handleStaffChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
        >
          {staff.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} {s.roleVisible ? `- ${s.roleVisible}` : ""}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 mt-1">
          Seleccionados: {formData.assignedStaff.length} persona{formData.assignedStaff.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
