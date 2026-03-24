import { requireAuth } from "@/lib/auth"
import StaffForm from "@/components/staff-form"

export default async function NuevoPersonalPage() {
  await requireAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuevo Personal</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <StaffForm />
      </div>
    </div>
  )
}
