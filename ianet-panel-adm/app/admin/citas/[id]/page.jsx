"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Stethoscope, 
  Apple, 
  ArrowLeft, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AppointmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch(`/api/admin/appointments/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setAppointment(data)
        } else {
          toast.error("No se pudo cargar la información de la cita")
          router.push("/admin/citas")
        }
      } catch (error) {
        toast.error("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAppointment()
    }
  }, [params.id, router])

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.")) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/appointments/${params.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Cita eliminada correctamente")
        router.push("/admin/citas")
      } else {
        toast.error("No se pudo eliminar la cita")
      }
    } catch (error) {
      toast.error("Error al eliminar")
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "solicitada":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase font-bold text-[10px]">Solicitada</Badge>
      case "confirmada":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase font-bold text-[10px]">Confirmada</Badge>
      case "atendida":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 uppercase font-bold text-[10px]">Atendida</Badge>
      case "cancelada":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 uppercase font-bold text-[10px]">Cancelada</Badge>
      default:
        return <Badge variant="outline" className="uppercase font-bold text-[10px]">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Cargando detalles de la cita...</p>
      </div>
    )
  }

  if (!appointment) return null

  const appointmentDate = new Date(appointment.dateTime)
  const isNutricional = appointment.type === "valoracion-nutricional"

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header / Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detalles de la Cita</h1>
            <p className="text-sm text-gray-500">ID: {appointment._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/citas/${appointment._id}/editar`}>
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-xl">
              <Edit className="w-4 h-4" />
              Editar Cita
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            className="gap-2 rounded-xl"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre Completo</label>
                  <p className="text-gray-800 font-medium text-lg mt-1">{appointment.patientName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado de la Cita</label>
                  <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400">Correo Electrónico</label>
                    <p className="text-gray-700 truncate">{appointment.patientEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400">Teléfono</label>
                    <p className="text-gray-700">{appointment.patientPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Horario y Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-24 h-24 bg-green-100 rounded-3xl flex flex-col items-center justify-center text-green-700">
                  <span className="text-xs font-bold uppercase">{format(appointmentDate, "MMM", { locale: es })}</span>
                  <span className="text-3xl font-black leading-none">{format(appointmentDate, "dd")}</span>
                  <span className="text-xs font-medium">{format(appointmentDate, "yyyy")}</span>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    {isNutricional ? (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none gap-1 px-3 py-1">
                        <Apple className="w-3.5 h-3.5" />
                        Valoración Nutricional
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none gap-1 px-3 py-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        Atención al Ciudadano
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="font-bold">{format(appointmentDate, "hh:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 capitalize">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>{format(appointmentDate, "eeee", { locale: es })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Notas y Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {appointment.notes ? (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 italic text-gray-600 leading-relaxed">
                  "{appointment.notes}"
                </div>
              ) : (
                <p className="text-gray-400 italic">No hay notas adicionales para esta cita.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-green-600 text-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Asignación
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-green-200 uppercase tracking-widest">Personal Responsable</label>
                  <p className="font-medium text-lg leading-tight">
                    {appointment.assignedStaff?.name || "No asignado todavía"}
                  </p>
                  {appointment.assignedStaff?.roleVisible && (
                    <p className="text-xs text-green-100">{appointment.assignedStaff.roleVisible}</p>
                  )}
                </div>
                
                {appointment.assignedStaff?.email && (
                  <div className="flex items-center gap-2 text-sm text-green-100">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{appointment.assignedStaff.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm border-l-4 border-l-yellow-400">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-700 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                Recordatorio
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Recuerda que estas citas están restringidas a los días Lunes y Martes administrativamente. Cualquier cambio de horario manual debe respetar esta normativa interna.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
