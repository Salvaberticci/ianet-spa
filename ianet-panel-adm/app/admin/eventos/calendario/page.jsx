import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import EventCalendar from "@/components/event-calendar"

async function getEvents() {
  await dbConnect()
  const events = await Event.find().sort({ date: 1 }).populate("assignedStaff", "name").lean()
  return JSON.parse(JSON.stringify(events))
}

export default async function CalendarPage() {
  await requireAuth()
  const events = await getEvents()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendario de Eventos</h1>
      <EventCalendar events={events} />
    </div>
  )
}
