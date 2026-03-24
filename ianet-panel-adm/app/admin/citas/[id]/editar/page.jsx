import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Staff from "@/models/Staff"
import AppointmentForm from "@/components/appointment-form"
import { notFound } from "next/navigation"

async function getAppointment(id) {
  await dbConnect()
  const appointment = await Appointment.findById(id).populate("assignedStaff").lean()
  if (!appointment) return null
  return JSON.parse(JSON.stringify(appointment))
}

async function getStaff() {
  await dbConnect()
  const staff = await Staff.find({ active: true }).lean()
  return JSON.parse(JSON.stringify(staff))
}

export default async function EditarCitaPage({ params }) {
  await requireAuth()
  const [appointment, staff] = await Promise.all([getAppointment(params.id), getStaff()])

  if (!appointment) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Cita</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AppointmentForm initialData={appointment} staff={staff} />
      </div>
    </div>
  )
}
