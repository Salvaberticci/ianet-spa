"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Helper: generates time slots from 08:30 to 14:00
const TIME_SLOTS = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"
]

export default function AppointmentForm({ initialData = null, staff = [] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  // Initial date/time processing
  const initialDateObj = initialData?.dateTime ? new Date(initialData.dateTime) : null
  const initialTime = initialDateObj ? format(initialDateObj, "HH:mm") : ""

  const [formData, setFormData] = useState({
    patientName: initialData?.patientName || "",
    patientEmail: initialData?.patientEmail || "",
    patientPhone: initialData?.patientPhone || "",
    type: initialData?.type || "atencion-ciudadano",
    appointmentDate: initialDateObj,
    appointmentTime: initialTime,
    assignedStaff: initialData?.assignedStaff?._id || "",
    status: initialData?.status || "solicitada",
    notes: initialData?.notes || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError("")
  }

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, appointmentDate: date }))
    if (formError) setFormError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!formData.appointmentDate) {
      setFormError("Por favor selecciona una fecha.")
      return
    }

    if (!formData.appointmentTime) {
      setFormError("Por favor selecciona una hora.")
      return
    }

    // Validación: nombre completo (al menos nombre y apellido con solo letras)
    const nameTrimmed = formData.patientName.trim()
    const nameParts = nameTrimmed.split(/\s+/).filter(Boolean)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑàèìòùÀÈÌÒÙ]+$/
    if (nameParts.length < 2 || !nameParts.every((p) => nameRegex.test(p))) {
      setFormError("El nombre debe contener al menos un nombre y un apellido, solo letras.")
      return
    }

    // Merge date and time
    const [hours, minutes] = formData.appointmentTime.split(":")
    const mergedDate = new Date(formData.appointmentDate)
    mergedDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

    // Validación cliente: no fechas pasadas
    if (mergedDate < new Date()) {
      setFormError("No puedes agendar una cita para una fecha y hora pasada.")
      return
    }

    setLoading(true)

    try {
      const url = initialData ? `/api/admin/appointments/${initialData._id}` : "/api/admin/appointments"
      const method = initialData ? "PATCH" : "POST"

      // Prepare payload with formatted ISO string
      const payload = {
        ...formData,
        dateTime: mergedDate.toISOString()
      }
      delete payload.appointmentDate
      delete payload.appointmentTime

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const label = initialData ? "actualizada" : "creada"
        toast.success(`Cita ${label} exitosamente`, {
          description: initialData ? `Se actualizaron los datos de ${formData.patientName}.` : `La cita de ${formData.patientName} ha sido agendada.`,
          icon: "✅",
        })
        setTimeout(() => {
          router.push("/admin/citas")
          router.refresh()
        }, 500)
      } else {
        const data = await res.json()
        const msg = data.error || "Error al guardar la cita"
        setFormError(msg)
        toast.error(msg, { icon: "❌" })
      }
    } catch (error) {
      const msg = "Error al conectar con el servidor. Intenta de nuevo."
      setFormError(msg)
      toast.error(msg, { icon: "⚠️" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Paciente *
          </label>
          <input
            id="patientName"
            name="patientName"
            type="text"
            required
            value={formData.patientName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email del Paciente *
          </label>
          <input
            id="patientEmail"
            name="patientEmail"
            type="email"
            required
            value={formData.patientEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono del Paciente *
          </label>
          <input
            id="patientPhone"
            name="patientPhone"
            type="tel"
            required
            value={formData.patientPhone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Cita *
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="atencion-ciudadano">Atención al Ciudadano</option>
            <option value="valoracion-nutricional">Valoración Nutricional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de la Cita *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal px-4 py-2 border border-gray-300 rounded-xl h-10 hover:bg-white focus:ring-2 focus:ring-green-500",
                  !formData.appointmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.appointmentDate ? (
                  format(formData.appointmentDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.appointmentDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0)) || // Past dates
                  (date.getDay() !== 1 && date.getDay() !== 2) // Monday or Tuesday only
                }
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <p className="mt-1 text-xs text-gray-500">🗓️ Solo Lunes y Martes.</p>
        </div>

        <div>
          <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
            Hora de la Cita *
          </label>
          <select
            id="appointmentTime"
            name="appointmentTime"
            required
            value={formData.appointmentTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecciona una hora</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">⏰ Horario: 8:30 AM – 2:00 PM.</p>
        </div>

        <div>
          <label htmlFor="assignedStaff" className="block text-sm font-medium text-gray-700 mb-2">
            Personal Asignado
          </label>
          <select
            id="assignedStaff"
            name="assignedStaff"
            value={formData.assignedStaff}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Sin asignar</option>
            {staff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} {s.roleVisible ? `- ${s.roleVisible}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="solicitada">Solicitada</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-2">
          <span className="flex-shrink-0">⚠️</span>
          <span>{formError}</span>
        </div>
      )}

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
