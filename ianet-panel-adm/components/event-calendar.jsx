"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function EventCalendar({ events }) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const eventsByDate = useMemo(() => {
    const map = new Map()
    events.forEach((event) => {
      const eventDate = new Date(event.date)
      const dateKey = format(eventDate, "yyyy-MM-dd")
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey).push(event)
    })
    return map
  }, [events])

  const eventDates = useMemo(() => {
    return Array.from(eventsByDate.keys()).map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number)
      return new Date(year, month - 1, day)
    })
  }, [eventsByDate])

  const handleDateSelect = (date) => {
    if (!date) return
    setSelectedDate(date)
    const dateKey = format(date, "yyyy-MM-dd")
    const dayEvents = eventsByDate.get(dateKey)
    if (dayEvents && dayEvents.length === 1) {
      router.push(`/admin/eventos/${dayEvents[0]._id}`)
    }
  }

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    const dateKey = format(selectedDate, "yyyy-MM-dd")
    return eventsByDate.get(dateKey) || []
  }, [selectedDate, eventsByDate])

  const modifiers = {
    hasEvent: eventDates,
  }

  const modifiersClassNames = {
    hasEvent: "bg-green-100 text-green-700 font-semibold hover:bg-green-200 data-[selected=true]:bg-green-600 data-[selected=true]:text-white",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            locale={es}
            className="rounded-md"
          />
          <p className="text-sm text-gray-600 mt-4 text-center">
            Los días con eventos están marcados en verde. Haz clic en un día con eventos para ver detalles.
          </p>
        </div>

        {selectedDateEvents.length > 0 && (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Eventos del {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/eventos/${event._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{event.name}</h4>
                      {event.time && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Hora:</span> {event.time}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Lugar:</span> {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                      )}
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
          </div>
        )}

        {selectedDateEvents.length === 0 && (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              No hay eventos para esta fecha. Selecciona un día marcado en verde para ver eventos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
