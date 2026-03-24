"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function HistoryUsersTable({ users, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState(searchParams.get("name") || "")
  const [email, setEmail] = useState(searchParams.get("email") || "")

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (name) params.set("name", name)
    if (email) params.set("email", email)
    router.push(`/admin/historias?${params.toString()}`)
  }

  const handleClear = () => {
    setName("")
    setEmail("")
    router.push(`/admin/historias`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">{pagination.total} resultados</div>
      </div>

      <form onSubmit={handleFilter} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Filtrar por email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 px-4 text-center text-gray-600">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.email} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/historias/${encodeURIComponent(user.email)}`}
                      className="px-3 py-1 rounded-lg text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      Ver historia
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/admin/historias?page=${page}${name ? `&name=${encodeURIComponent(name)}` : ""}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
              className={`px-4 py-2 rounded-lg ${
                page === pagination.page ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


