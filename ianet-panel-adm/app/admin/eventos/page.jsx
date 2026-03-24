import { requireAuth } from "@/lib/auth"
import { isFeatureEnabled } from "@/lib/featureFlags"
import { notFound } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Link from "next/link"
import { Plus, Calendar } from "lucide-react"
import EventTable from "@/components/event-table"
import UpcomingEvents from "@/components/upcoming-events"

async function getEvents(searchParams) {
  await dbConnect()

  const page = Number.parseInt(searchParams.page || "1")
  const limit = 10

  const skip = (page - 1) * limit

  const [events, total] = await Promise.all([
    Event.find().sort({ date: -1 }).skip(skip).limit(limit).populate("assignedStaff", "name").lean(),
    Event.countDocuments(),
  ])

  return {
    events: JSON.parse(JSON.stringify(events)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function EventosPage({ searchParams }) {
  await requireAuth()
  if (!isFeatureEnabled("events")) return notFound()
  const { events, pagination } = await getEvents(searchParams)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Eventos</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/eventos/calendario"
            className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-xl hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Calendar className="w-5 h-5" />
            Calendario
          </Link>
          <Link
            href="/admin/eventos/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Evento
          </Link>
        </div>
      </div>

      <UpcomingEvents />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EventTable events={events} pagination={pagination} />
      </div>
    </div>
  )
}
