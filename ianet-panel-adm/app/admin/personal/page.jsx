import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Staff from "@/models/Staff"
import Link from "next/link"
import { Plus } from "lucide-react"
import StaffTable from "@/components/staff-table"

async function getStaff(rawSearchParams) {
  await dbConnect()

  const searchParams = await rawSearchParams

  const active = searchParams?.active
  const page = Number.parseInt(searchParams?.page || "1")
  const limit = 10

  const query = {}

  if (active !== undefined && active !== "") {
    query.active = active === "true"
  }

  const skip = (page - 1) * limit

  const [staff, total] = await Promise.all([
    Staff.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Staff.countDocuments(query),
  ])

  return {
    staff: JSON.parse(JSON.stringify(staff)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export default async function PersonalPage({ searchParams }) {
  await requireAuth()
  const resolvedSearchParams = await searchParams
  const { staff, pagination } = await getStaff(Promise.resolve(resolvedSearchParams))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Personal</h1>
        <Link
          href="/admin/personal/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Personal
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <StaffTable staff={staff} pagination={pagination} />
      </div>
    </div>
  )
}
