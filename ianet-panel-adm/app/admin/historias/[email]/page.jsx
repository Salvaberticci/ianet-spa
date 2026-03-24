import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PatientNutritionalData from "@/components/patient-nutritional-data"

async function getAppointmentsByEmail(email) {
  await dbConnect()

  const appointments = await Appointment.find({ patientEmail: decodeURIComponent(email) })
    .sort({ dateTime: -1 })
    .populate("assignedStaff", "name")
    .lean()

  return JSON.parse(JSON.stringify(appointments))
}

export default async function HistoriaUsuarioPage({ params }) {
  await requireAuth()
  const email = params.email
  const appointments = await getAppointmentsByEmail(email)

  const patientName = appointments[0]?.patientName || "Paciente"
  const safeEmail = decodeURIComponent(email)

  return (
    <div>
      <Link
        href="/admin/historias"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la lista
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">Historia</h1>
      <p className="text-gray-600 mb-6">{patientName} · {safeEmail}</p>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Citas</h2>
          {appointments.length === 0 ? (
            <div className="text-gray-600">Sin citas registradas.</div>
          ) : (
            <div className="space-y-4">
              {appointments.map((a) => (
                <div key={a._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Personal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{new Date(a.dateTime).toLocaleString("es-ES")}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                a.status === "solicitada"
                                  ? "bg-blue-100 text-blue-700"
                                  : a.status === "confirmada"
                                  ? "bg-green-100 text-green-700"
                                  : a.status === "atendida"
                                  ? "bg-gray-100 text-gray-700"
                                  : a.status === "cancelada"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700 capitalize">{a.type}</td>
                          <td className="py-3 px-4 text-gray-700">{a.assignedStaff?.name || "Sin asignar"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {a.notes && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-500 mb-1">Notas</div>
                      <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 rounded-lg p-3">{a.notes}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <PatientNutritionalData patientEmail={safeEmail} patientName={patientName} />
      </div>
    </div>
  )
}


