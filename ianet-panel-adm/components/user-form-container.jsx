"use client"

import { useState } from "react"
import UserTable from "@/components/user-table"
import UserForm from "@/components/user-form"
import { UserPlus, LayoutList } from "lucide-react"

export default function UserFormContainer({ currentUserId, initialUsers }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <UserPlus className="w-5 h-5" />
            Crear Nuevo Usuario
          </button>
        ) : (
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <LayoutList className="w-5 h-5" />
            Ver Lista de Usuarios
          </button>
        )}
      </div>

      {showForm ? (
        <UserForm closeForm={() => setShowForm(false)} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <UserTable users={initialUsers} currentUserId={currentUserId} />
        </div>
      )}
    </div>
  )
}
