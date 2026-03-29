"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/atoms/Card"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { toast } from "sonner"
import { Settings, Mail, Save, Loader2, Info } from "lucide-react"

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    institutionalEmail: "",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings({
          institutionalEmail: data.institutionalEmail || "",
        })
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error)
      toast.error("No se pudo cargar la configuración")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success("Configuración guardada exitosamente")
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al guardar")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Cargando configuración...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-8 h-8 text-green-600" />
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona los parámetros globales de funcionamiento de IANET.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-blue-800">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Los cambios realizados aquí afectan a todo el sistema en tiempo real.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-600" />
            Notificaciones
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Institucional para Avisos
              </label>
              <input
                type="email"
                value={settings.institutionalEmail}
                onChange={(e) => setSettings({ ...settings, institutionalEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                placeholder="ejemplo@institucion.gob.ve"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                A este correo llegarán las alertas automáticas cada vez que un ciudadano solicite una nueva cita desde la web.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
