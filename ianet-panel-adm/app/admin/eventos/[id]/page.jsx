import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Staff from "@/models/Staff"
import { notFound } from "next/navigation"
import EventDetail from "@/components/event-detail"

async function getEvent(id) {
  await dbConnect()
  const event = await Event.findById(id).populate("assignedStaff", "name roleVisible").lean()
  if (!event) return null
  return JSON.parse(JSON.stringify(event))
}

async function getStaff() {
  await dbConnect()
  const staff = await Staff.find({ active: true }).lean()
  return JSON.parse(JSON.stringify(staff))
}

export default async function EventDetailPage({ params }) {
  await requireAuth()
  const resolvedParams = await params
  const [event, staff] = await Promise.all([getEvent(resolvedParams.id), getStaff()])

  if (!event) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detalle del Evento</h1>
      <EventDetail event={event} staff={staff} />
    </div>
  )
}
