"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function PatientNutritionalData({ patientEmail, patientName }) {
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    date: "",
    weight: "",
    height: "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [patientEmail])

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/nutritional-data/patient/${encodeURIComponent(patientEmail)}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching nutritional data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        patientEmail,
        patientName,
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        notes: formData.notes || "",
      }

      const url = editingId
        ? `/api/admin/nutritional-data/${editingId}`
        : "/api/admin/nutritional-data"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowForm(false)
        setEditingId(null)
        setFormData({ date: "", weight: "", height: "", notes: "" })
        fetchData()
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || "Error al guardar los datos")
      }
    } catch (error) {
      alert("Error al guardar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setFormData({
      date: new Date(item.date).toISOString().split("T")[0],
      weight: item.weight || "",
      height: item.height || "",
      notes: item.notes || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/nutritional-data/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchData()
        router.refresh()
      } else {
        alert("Error al eliminar el registro")
      }
    } catch (error) {
      alert("Error al eliminar el registro")
    } finally {
      setLoading(false)
    }
  }

  const chartData = useMemo(() => {
    return data
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        fecha: format(new Date(item.date), "MMM yyyy", { locale: es }),
        peso: item.weight,
        imc: item.bmi,
      }))
  }, [data])

  const chartConfig = {
    peso: {
      label: "Peso (kg)",
      color: "hsl(var(--chart-1))",
    },
    imc: {
      label: "IMC",
      color: "hsl(var(--chart-2))",
    },
  }

  if (loading && data.length === 0) {
    return <div className="text-gray-500">Cargando datos nutricionales...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Datos Nutricionales Mensuales</h2>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({ date: "", weight: "", height: "", notes: "" })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Editar Registro" : "Nuevo Registro Mensual"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha (Mes/Año) *
                </label>
                <input
                  id="date"
                  type="month"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ date: "", weight: "", height: "", notes: "" })
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {data.length > 0 && chartData.some((d) => d.peso || d.imc) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución</h3>
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {chartData.some((d) => d.peso) && (
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="var(--color-peso)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
              {chartData.some((d) => d.imc) && (
                <Line
                  type="monotone"
                  dataKey="imc"
                  stroke="var(--color-imc)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ChartContainer>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial</h3>
        {data.length === 0 ? (
          <p className="text-gray-500">No hay datos nutricionales registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Peso (kg)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Altura (cm)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">IMC</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Notas</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      {format(new Date(item.date), "MMMM yyyy", { locale: es })}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.weight || "-"}</td>
                    <td className="py-3 px-4 text-gray-600">{item.height || "-"}</td>
                    <td className="py-3 px-4 text-gray-600">{item.bmi ? item.bmi.toFixed(2) : "-"}</td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="max-w-xs truncate">{item.notes || "-"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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
        )}
      </div>
    </div>
  )
}

