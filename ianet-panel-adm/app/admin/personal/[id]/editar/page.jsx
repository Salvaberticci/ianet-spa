import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Staff from "@/models/Staff"
import StaffForm from "@/components/staff-form"
import { notFound } from "next/navigation"

async function getStaff(id) {
  await dbConnect()
  const staff = await Staff.findById(id).lean()
  if (!staff) return null
  return JSON.parse(JSON.stringify(staff))
}

export default async function EditarPersonalPage({ params }) {
  await requireAuth()
  const staff = await getStaff(params.id)

  if (!staff) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Personal</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <StaffForm initialData={staff} />
      </div>
    </div>
  )
}
