import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"
import Contact from "@/models/Contact"
import Appointment from "@/models/Appointment"
import Inventory from "@/models/Inventory"
import { Newspaper, MessageSquare, Calendar, AlertTriangle } from "lucide-react"

async function getDashboardStats() {
  await dbConnect()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [publishedNews, newMessages, todayAppointments, lowStock] = await Promise.all([
    News.countDocuments({ status: "publicada" }),
    Contact.countDocuments({ status: "nuevo" }),
    Appointment.countDocuments({
      dateTime: { $gte: today },
      status: "solicitada",
    }),
    Inventory.countDocuments({ stock: { $lte: 10 }, status: "activo" }),
  ])

  return {
    publishedNews,
    newMessages,
    todayAppointments,
    lowStock,
  }
}

export default async function AdminDashboard() {
  await requireAuth()
  const stats = await getDashboardStats()

  const cards = [
    {
      title: "Noticias Publicadas",
      value: stats.publishedNews,
      icon: Newspaper,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Mensajes Nuevos",
      value: stats.newMessages,
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Citas Solicitadas Hoy",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Stock Bajo",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/noticias"
            className="p-4 border border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-1">Gestionar Noticias</h3>
            <p className="text-sm text-gray-600">Crear y publicar noticias</p>
          </a>
          <a
            href="/admin/citas"
            className="p-4 border border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-1">Ver Citas</h3>
            <p className="text-sm text-gray-600">Gestionar citas médicas</p>
          </a>
          <a
            href="/admin/inventario"
            className="p-4 border border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-800 mb-1">Inventario</h3>
            <p className="text-sm text-gray-600">Controlar stock de productos</p>
          </a>
        </div>
      </div>
    </div>
  )
}
