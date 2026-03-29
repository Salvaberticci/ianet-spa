"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Card } from "../components/atoms/Card"
import { Input } from "../components/atoms/Input"
import { Select } from "../components/atoms/Select"
import { Textarea } from "../components/atoms/Textarea"
import { Button } from "../components/atoms/Button"
import { Toast } from "../components/atoms/Toast"
import { useForm } from "../hooks/useForm"
import { appointmentsService } from "../services/appointmentsService"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { cn } from "../../lib/utils"

const validationRules = {
  patientName: [{ type: "required", message: "El nombre es requerido" }],
  patientEmail: [
    { type: "required", message: "El email es requerido" },
    { type: "email", message: "Email inválido" },
  ],
  patientPhone: [{ type: "phone", message: "Teléfono inválido (8-20 caracteres, puede incluir +, -, espacios)" }],
  type: [
    { type: "required", message: "El tipo de cita es requerido" },
    { type: "appointmentType", message: "Tipo de cita inválido" },
  ],
}

const appointmentTypes = [
  { value: "atencion-ciudadano", label: "Atención al Ciudadano" },
  { value: "valoracion-nutricional", label: "Valoración Nutricional" },
]

export function SolicitudesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const { values, errors, touched, handleChange, handleBlur, validateAll, reset } = useForm(
    {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      type: "",
      notes: "",
      appointmentDate: null,
      appointmentTime: "",
    },
    validationRules,
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare payload
      const payload = {
        patientName: values.patientName,
        patientEmail: values.patientEmail,
        patientPhone: values.patientPhone,
        type: values.type,
        notes: values.notes,
      }

      // Validation: Schedule check
      if (!values.appointmentDate || !values.appointmentTime) {
        setToast({ type: "error", message: "Debe seleccionar una fecha y hora preferida válida." })
        setIsSubmitting(false)
        return
      }

      const [hours, minutes] = values.appointmentTime.split(":")
      const mergedDate = new Date(values.appointmentDate)
      mergedDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0)
      
      payload.dateTime = mergedDate.toISOString()


      const response = await appointmentsService.create(payload)
      console.log("[DEBUG] Appointment Response:", response)

      if (response.mailStatus && !response.mailStatus.sent) {
        setToast({
          type: "warning",
          message: `Cita registrada, pero el aviso por correo falló: ${response.mailStatus.error || "Error SMTP"}. Revisa la consola para más detalles.`,
        })
      } else {
        setToast({
          type: "success",
          message: "Solicitud de cita enviada exitosamente. Se ha enviado un aviso a la institución.",
        })
      }
      reset()
    } catch (error) {
      console.error("[DEBUG] Submission Error:", error)
      setToast({ type: "error", message: error.message || "Error al enviar la solicitud." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-16 md:py-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4 text-balance">Solicitar Cita</h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Completa el formulario para solicitar atención al ciudadano o valoración nutricional. 
            <strong> Horario de atención: Lunes y Martes de 8:30 AM a 2:00 PM.</strong>
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-1">Atención al Ciudadano</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Asistencia y orientación especializada para trámites y servicios institucionales.
              </p>
            </div>
          </Card>

          <Card className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-1">Valoración Nutricional</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Evaluación nutricional personalizada para el seguimiento de tu bienestar físico.
              </p>
            </div>
          </Card>
        </div>

        {/* Form Card */}
        <Card>
          <h2 className="text-2xl font-bold text-green-700 mb-6">Datos de la Solicitud</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient Name */}
            <Input
              label="Nombre Completo"
              name="patientName"
              value={values.patientName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.patientName ? errors.patientName : null}
              placeholder="Ej: Juan Pérez"
              required
            />

            {/* Patient Email */}
            <Input
              label="Correo Electrónico"
              name="patientEmail"
              type="email"
              value={values.patientEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.patientEmail ? errors.patientEmail : null}
              placeholder="tu@email.com"
              required
            />

            {/* Patient Phone */}
            <Input
              label="Teléfono"
              name="patientPhone"
              type="tel"
              value={values.patientPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.patientPhone ? errors.patientPhone : null}
              placeholder="+58-412-1234567"
            />

            {/* Appointment Type */}
            <Select
              label="Tipo de Cita"
              name="type"
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.type ? errors.type : null}
              options={appointmentTypes}
              placeholder="Selecciona el tipo de cita"
              required
            />

            {/* Preferred Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Column */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Preferida <span className="text-red-500 font-bold">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-start text-left font-normal px-4 py-2 border border-green-300 rounded-2xl bg-white hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 h-10",
                        !values.appointmentDate && "text-gray-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.appointmentDate ? format(values.appointmentDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-white shadow-xl rounded-xl border border-gray-200" align="start">
                    <Calendar
                      mode="single"
                      selected={values.appointmentDate}
                      onSelect={(date) => handleChange("appointmentDate", date)}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || (date.getDay() !== 1 && date.getDay() !== 2)
                      }}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-gray-500 mt-1">🗓️ Solo Lunes y Martes.</p>
              </div>

              {/* Time Column */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Preferida <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  name="appointmentTime"
                  value={values.appointmentTime}
                  onChange={(e) => handleChange("appointmentTime", e.target.value)}
                  className="w-full px-4 py-2 border border-green-300 rounded-2xl bg-white flex items-center h-10 focus:outline-none focus:ring-2 focus:ring-green-600 hover:bg-green-50 transition-colors"
                  required
                >
                  <option value="">Selecciona la hora</option>
                  <option value="08:30">08:30 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="09:30">09:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">🕒 De 08:30 AM a 02:00 PM.</p>
              </div>
            </div>

            {/* Notes */}
            <Textarea
              label="Notas Adicionales"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.notes ? errors.notes : null}
              placeholder="Información adicional que consideres relevante (síntomas, alergias, etc.)"
              rows={4}
            />

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-green-800 leading-relaxed">
                  <p className="font-medium mb-1">Importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Atención exclusiva los días <strong>Lunes y Martes</strong>.</li>
                    <li>Horario: <strong>08:30 AM a 02:00 PM</strong>.</li>
                    <li>Tu solicitud será revisada y recibirás respuesta en máximo 48h.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full text-base py-3">
              {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud"}
            </Button>
          </form>
        </Card>

        {/* Additional Info */}
        <Card className="mt-8 bg-gray-50">
          <h3 className="font-bold text-green-700 mb-4">¿Necesitas ayuda?</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Si tienes alguna duda o necesitas asistencia inmediata, puedes contactarnos directamente:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>contacto@ianet.gob.ve</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default SolicitudesPage


