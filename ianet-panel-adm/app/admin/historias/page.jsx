import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import HistoryUsersTable from "@/components/history-users-table"

async function getPatients(searchParams) {
  await dbConnect()

  const name = searchParams.name || ""
  const email = searchParams.email || ""
  const page = Number.parseInt(searchParams.page || "1")
  const limit = 10

  const skip = (page - 1) * limit

  const matchStage = {}
  if (name) matchStage.patientName = { $regex: name, $options: "i" }
  if (email) matchStage.patientEmail = { $regex: email, $options: "i" }

  const [rows, countAgg] = await Promise.all([
    Appointment.aggregate([
      { $match: matchStage },
      { $sort: { dateTime: -1 } },
      {
        $group: {
          _id: "$patientEmail",
          name: { $first: "$patientName" },
          email: { $first: "$patientEmail" },
          lastDate: { $first: "$dateTime" },
          count: { $sum: 1 },
        },
      },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]).exec(),
    Appointment.aggregate([
      { $match: matchStage },
      {
        $group: { _id: "$patientEmail" },
      },
      { $count: "total" },
    ]).exec(),
  ])

  const total = countAgg[0]?.total || 0

  return {
    patients: JSON.parse(JSON.stringify(rows)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function HistoriasPage({ searchParams }) {
  await requireAuth()
  const { patients, pagination } = await getPatients(searchParams)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Historias</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <HistoryUsersTable users={patients} pagination={pagination} />
      </div>
    </div>
  )
}


