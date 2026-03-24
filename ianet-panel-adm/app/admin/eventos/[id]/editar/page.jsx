import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import Staff from "@/models/Staff"
import EventForm from "@/components/event-form"
import { notFound } from "next/navigation"

async function getEvent(id) {
  await dbConnect()
  const event = await Event.findById(id).populate("assignedStaff").lean()
  if (!event) return null
  return JSON.parse(JSON.stringify(event))
}

async function getStaff() {
  await dbConnect()
  const staff = await Staff.find({ active: true }).lean()
  return JSON.parse(JSON.stringify(staff))
}

export default async function EditarEventoPage({ params }) {
  await requireAuth()
  const [event, staff] = await Promise.all([getEvent(params.id), getStaff()])

  if (!event) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Evento</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EventForm initialData={event} staff={staff} />
      </div>
    </div>
  )
}
