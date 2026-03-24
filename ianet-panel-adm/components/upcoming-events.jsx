"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, AlertCircle } from "lucide-react"

export default function UpcomingEvents() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await fetch("/api/admin/events/upcoming")
        if (res.ok) {
          const data = await res.json()
          setEvents(data.events || [])
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">Cargando eventos próximos...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Eventos Próximos ({events.length})
          </h2>
        </div>
        <Link
          href="/admin/eventos/calendario"
          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          Ver calendario
          <Calendar className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {events.slice(0, 5).map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/admin/eventos/${event._id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{event.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="font-medium">{formatDate(event.date)}</span>
                  {event.time && <span>• {event.time}</span>}
                  {event.location && <span>• {event.location}</span>}
                </div>
              </div>
            </div>
            {event.assignedStaff && event.assignedStaff.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {event.assignedStaff.length} persona{event.assignedStaff.length !== 1 ? "s" : ""} asignada
                {event.assignedStaff.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        ))}
      </div>

      {events.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            href="/admin/eventos"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Ver todos los eventos ({events.length} total)
          </Link>
        </div>
      )}
    </div>
  )
}
