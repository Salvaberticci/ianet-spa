import { requireAdmin } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import UserTable from "@/components/user-table"
import UserFormContainer from "@/components/user-form-container"
import { Users, UserPlus, ShieldAlert } from "lucide-react"

export const dynamic = "force-dynamic"

async function getUsers() {
  await dbConnect()
  const users = await User.find({}, "-password").sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(users))
}

export default async function UsuariosPage() {
  const session = await requireAdmin()
  const users = await getUsers()
  const currentUserId = session.user.id

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los accesos y roles de los trabajadores del sistema IANET.
          </p>
        </div>
      </div>

      <div className="bg-amber-100 border border-amber-200 rounded-xl p-4 flex items-start gap-4 text-amber-900">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-1" />
        <div className="text-sm">
          <p className="font-bold">Aviso de Seguridad:</p>
          <p>Solo los usuarios con rol de **Administrador** pueden acceder a esta sección y crear o modificar perfiles. Los editores tienen el acceso restringido a este módulo.</p>
        </div>
      </div>

      <UserFormContainer currentUserId={currentUserId} initialUsers={users} />
    </div>
  )
}
