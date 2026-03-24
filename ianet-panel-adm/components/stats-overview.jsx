"use client"

import { useState, useEffect } from "react"
import { Calendar, CalendarDays, Package, MessageSquare, Users, FileText } from "lucide-react"

export default function StatsOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats/general")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div className="text-gray-500">Error al cargar estadísticas</div>
  }

  const cards = [
    {
      title: "Total de Citas",
      value: stats.appointments.total,
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Citas Médicas",
      value: stats.appointments.medical,
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Citas Nutricionales",
      value: stats.appointments.nutritional,
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total de Eventos",
      value: stats.events.total,
      icon: CalendarDays,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Productos en Inventario",
      value: stats.inventory.total,
      icon: Package,
      color: "bg-indigo-100 text-indigo-600",
      subtitle: `${stats.inventory.active} activos`,
    },
    {
      title: "Mensajes de Contacto",
      value: stats.contacts.total,
      icon: MessageSquare,
      color: "bg-pink-100 text-pink-600",
      subtitle: `${stats.contacts.new} nuevos`,
    },
    {
      title: "Pacientes Únicos",
      value: stats.patients.unique,
      icon: Users,
      color: "bg-teal-100 text-teal-600",
    },
    {
      title: "Registros Nutricionales",
      value: stats.nutritional.totalRecords,
      icon: FileText,
      color: "bg-emerald-100 text-emerald-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stats ? card.value : "-"}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

