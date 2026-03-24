import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Staff from "@/models/Staff"
import AppointmentForm from "@/components/appointment-form"

async function getStaff() {
  await dbConnect()
  const staff = await Staff.find({ active: true }).lean()
  return JSON.parse(JSON.stringify(staff))
}

export default async function NuevaCitaPage() {
  await requireAuth()
  const staff = await getStaff()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nueva Cita</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AppointmentForm staff={staff} />
      </div>
    </div>
  )
}
