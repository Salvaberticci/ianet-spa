"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, Newspaper, MessageSquare, Calendar, Package, CalendarDays, Users, FileText, BarChart, LogOut, UserPlus, Settings } from "lucide-react"
import Image from 'next/image'
import { isFeatureEnabled } from "@/lib/featureFlags"
import { toast } from "sonner"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Noticias",
    href: "/admin/noticias",
    icon: Newspaper,
  },
  {
    title: "Contacto",
    href: "/admin/contacto",
    icon: MessageSquare,
  },
  {
    title: "Citas",
    href: "/admin/citas",
    icon: Calendar,
  },
  {
    title: "Inventario",
    href: "/admin/inventario",
    icon: Package,
  },
  {
    title: "Eventos",
    href: "/admin/eventos",
    icon: CalendarDays,
  },
  {
    title: "Personal",
    href: "/admin/personal",
    icon: Users,
  },
  {
    title: "Historias",
    href: "/admin/historias",
    icon: FileText,
  },
  {
    title: "Estadísticas",
    href: "/admin/estadisticas",
    icon: BarChart,
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: UserPlus,
    isAdminOnly: true,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    isAdminOnly: true,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role
  const [appointmentCount, setAppointmentCount] = useState(0)
  const prevCountRef = useRef(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/appointments/count")
        if (res.ok) {
          const data = await res.json()
          
          // Si el nuevo conteo es mayor al anterior, disparamos una notificación
          if (data.count > prevCountRef.current && prevCountRef.current !== 0) {
            toast.success("¡Nueva solicitud de cita recibida!", {
              description: "Revisa la sección de Citas para más detalles.",
              duration: 5000,
            })
          }
          
          setAppointmentCount(data.count)
          prevCountRef.current = data.count
        }
      } catch (error) {
        console.error("Error al obtener conteo de citas:", error)
      }
    }

    fetchCount()
    // Refrescar cada 10 segundos para una experiencia "en vivo" más inmediata
    const interval = setInterval(fetchCount, 10 * 1000)
    
    // Marcar como montado para evitar error de hidratación
    setIsMounted(true)
    
    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  // Si no está montado, renderizamos una versión estática o vacía para evitar desajustes con el servidor
  if (!isMounted) {
    return <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm" />
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Image src="/logo-ianet-verde.png" alt="Logo IANET" width={120} height={24} className="h-12 w-auto" priority />
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems
            .filter((item) => {
              if (item.isAdminOnly && userRole !== "admin") return false
              if (item.href.startsWith("/admin/inventario")) return isFeatureEnabled("inventory")
              if (item.href.startsWith("/admin/eventos")) return isFeatureEnabled("events")
              return true
            })
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.title === "Citas" && appointmentCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {appointmentCount > 99 ? "99+" : appointmentCount}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
