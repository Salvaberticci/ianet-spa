"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export default function Header() {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Bienvenido, {session?.user?.name || "Usuario"}</h2>
          <p className="text-sm text-gray-600">{session?.user?.role === "admin" ? "Administrador" : "Editor"}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{session?.user?.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
