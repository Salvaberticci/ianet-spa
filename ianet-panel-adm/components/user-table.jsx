"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Edit2, Trash2, UserSlash, UserCheck, Shield, UserPen } from "lucide-react"

export default function UserTable({ users, currentUserId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async (user) => {
    if (user._id === currentUserId) {
      toast.error("No puedes desactivarte a ti mismo", { icon: "⚠️" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      })

      if (res.ok) {
        toast.success(`Usuario ${!user.active ? "activado" : "desactivado"} exitosamente`)
        router.refresh()
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al actualizar estado")
      }
    } catch (err) {
      toast.error("Error de conexión al servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (user) => {
    if (user._id === currentUserId) {
      toast.error("No puedes eliminarte a ti mismo")
      return
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, { method: "DELETE" })

      if (res.ok) {
        toast.success("Usuario eliminado exitosamente")
        router.refresh()
      } else {
        const error = await res.json()
        toast.error(error.error || "Error al eliminar usuario")
      }
    } catch (err) {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Usuario</th>
            <th className="px-6 py-4 text-center">Rol</th>
            <th className="px-6 py-4 text-center">Estado</th>
            <th className="px-6 py-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold mr-3 border border-green-200 uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                  user.role === "admin" 
                    ? "bg-purple-50 text-purple-700 border-purple-200" 
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {user.role === "admin" && <Shield className="w-3 h-3" />}
                  {user.role === "admin" ? "Administrador" : "Editor"}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  user.active 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {user.active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(user)}
                    disabled={loading}
                    className={`p-2 rounded-lg transition-colors border ${
                      user.active 
                        ? "text-orange-600 border-orange-200 hover:bg-orange-50" 
                        : "text-green-600 border-green-200 hover:bg-green-50"
                    }`}
                    title={user.active ? "Desactivar usuario" : "Activar usuario"}
                  >
                    {user.active ? <UserSlash size={18} /> : <UserCheck size={18} />}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    disabled={loading}
                    className="p-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    title="Eliminar usuario definitivamente"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
                No hay otros usuarios registrados en el sistema.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
