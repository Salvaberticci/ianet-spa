import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Staff from "@/models/Staff"
import Link from "next/link"
import { Plus } from "lucide-react"
import AppointmentTable from "@/components/appointment-table"

async function getAppointments(rawSearchParams) {
  await dbConnect()

  const searchParams = await rawSearchParams

  const status = searchParams?.status || ""
  const type = searchParams?.type || ""
  const date = searchParams?.date || ""
  const page = Number.parseInt(searchParams?.page || "1")
  const limit = 10

  const query = {}

  if (status) query.status = status
  if (type) query.type = type
  if (date) {
    const startDate = new Date(date)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)
    query.dateTime = { $gte: startDate, $lt: endDate }
  }

  const skip = (page - 1) * limit

  const [appointments, total] = await Promise.all([
    Appointment.find(query).sort({ dateTime: 1 }).skip(skip).limit(limit).populate("assignedStaff", "name").lean(),
    Appointment.countDocuments(query),
  ])

  return {
    appointments: JSON.parse(JSON.stringify(appointments)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function CitasPage({ searchParams }) {
  await requireAuth()
  const resolvedSearchParams = await searchParams
  const { appointments, pagination } = await getAppointments(Promise.resolve(resolvedSearchParams))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Citas</h1>
        <Link
          href="/admin/citas/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AppointmentTable appointments={appointments} pagination={pagination} />
      </div>
    </div>
  )
}
