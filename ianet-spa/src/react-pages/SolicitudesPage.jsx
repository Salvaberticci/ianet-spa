"use client"

import { useState } from "react"
import { Card } from "../components/atoms/Card"
import { Input } from "../components/atoms/Input"
import { Select } from "../components/atoms/Select"
import { Textarea } from "../components/atoms/Textarea"
import { Button } from "../components/atoms/Button"
import { Toast } from "../components/atoms/Toast"
import { useForm } from "../hooks/useForm"
import { appointmentsService } from "../services/appointmentsService"

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
  { value: "medica", label: "Consulta Médica" },
  { value: "nutricional", label: "Consulta Nutricional" },
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
      dateTime: "",
      notes: "",
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

      // Only include dateTime if provided
      if (values.dateTime) {
        payload.dateTime = new Date(values.dateTime).toISOString()
      }

      await appointmentsService.create(payload)
      setToast({
        type: "success",
        message: "Solicitud de cita enviada exitosamente. Nos pondremos en contacto pronto para confirmar.",
      })
      reset()
    } catch (error) {
      setToast({ type: "error", message: error.message || "Error al enviar la solicitud. Intenta nuevamente." })
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
            Completa el formulario para solicitar una cita médica o nutricional. Nos pondremos en contacto contigo para
            confirmar la fecha y hora.
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
              <h3 className="font-bold text-green-700 mb-1">Consulta Médica</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Atención médica especializada para evaluación y seguimiento de tu salud.
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
              <h3 className="font-bold text-green-700 mb-1">Consulta Nutricional</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Evaluación nutricional personalizada para mejorar tus hábitos alimenticios.
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
            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora Preferida <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <input
                id="dateTime"
                name="dateTime"
                type="datetime-local"
                value={values.dateTime}
                min={(() => {
                  const now = new Date()
                  now.setSeconds(0, 0)
                  const pad = (n) => String(n).padStart(2, "0")
                  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
                })()}
                onChange={(e) => handleChange("dateTime", e.target.value)}
                className="w-full border border-green-300 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta es una fecha sugerida (solo fechas futuras). Nos pondremos en contacto para confirmar disponibilidad.
              </p>
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
                    <li>Tu solicitud será revisada por nuestro equipo.</li>
                    <li>Te contactaremos en un plazo máximo de 48 horas.</li>
                    <li>Asegúrate de proporcionar información de contacto correcta.</li>
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


