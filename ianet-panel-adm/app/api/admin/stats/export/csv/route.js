import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Event from "@/models/Event"
import Inventory from "@/models/Inventory"
import Contact from "@/models/Contact"
import NutritionalData from "@/models/NutritionalData"
import Staff from "@/models/Staff"

function escapeCSV(value) {
  if (value === null || value === undefined) return ""
  const stringValue = String(value)
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function buildDateRange(searchParams) {
  const startParam = searchParams.get("start")
  const endParam = searchParams.get("end")
  const period = searchParams.get("period") || "month"
  const now = new Date()

  if (startParam && endParam) {
    const start = new Date(startParam)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endParam)
    end.setHours(23, 59, 59, 999)
    return { start, end, label: `Reporte por Rango de Fechas (${startParam} a ${endParam})` }
  }

  const start = new Date()
  if (period === "day") {
    start.setHours(0, 0, 0, 0)
    const endDay = new Date()
    endDay.setHours(23, 59, 59, 999)
    return { start, end: endDay, label: "Reporte del Día" }
  }
  if (period === "week") {
    start.setDate(now.getDate() - 7)
    start.setHours(0, 0, 0, 0)
    return { start, end: now, label: "Reporte por Semana" }
  }
  // Default: month (Last 30 days)
  start.setDate(now.getDate() - 30)
  start.setHours(0, 0, 0, 0)
  return { start, end: now, label: "Reporte del Mes" }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const { start, end, label } = buildDateRange(searchParams)
    const dateRange = { $gte: start, $lte: end }

    const [appointments, events, inventory, contacts, nutritionalData] = await Promise.all([
      Appointment.find({ dateTime: dateRange }).populate("assignedStaff").lean(),
      Event.find({ date: dateRange }).populate("assignedStaff").lean(),
      Inventory.find().lean(),
      Contact.find({ createdAt: dateRange }).lean(),
      NutritionalData.find({ date: dateRange }).sort({ date: -1 }).lean(),
    ])

    let csv = "ESTADÍSTICAS GENERALES IANET\n"
    csv += `Período: ${label}\n`
    csv += `Generado el: ${new Date().toLocaleString("es-ES")}\n\n`

    // Resumen
    csv += "RESUMEN\n"
    csv += `Total de Citas,${appointments.length}\n`
    csv += `Citas Médicas,${appointments.filter((a) => a.type === "medica").length}\n`
    csv += `Citas Nutricionales,${appointments.filter((a) => a.type === "nutricional").length}\n`
    csv += `Total de Eventos,${events.length}\n`
    csv += `Productos en Inventario,${inventory.length}\n`
    csv += `Mensajes de Contacto,${contacts.length}\n`
    csv += `Registros Nutricionales,${nutritionalData.length}\n\n`

    // Citas
    csv += "CITAS\n"
    csv += "Paciente,Email,Teléfono,Tipo,Estado,Fecha/Hora,Personal,Notas\n"
    appointments.forEach((a) => {
      csv += `${escapeCSV(a.patientName)},${escapeCSV(a.patientEmail)},${escapeCSV(a.patientPhone)},${escapeCSV(a.type)},${escapeCSV(a.status)},${escapeCSV(new Date(a.dateTime).toLocaleString("es-ES"))},${escapeCSV(a.assignedStaff?.name || "Sin asignar")},${escapeCSV(a.notes || "")}\n`
    })
    csv += "\n"

    // Eventos
    csv += "EVENTOS\n"
    csv += "Nombre,Fecha,Hora,Lugar,Responsable,Descripción,Personal Asignado\n"
    events.forEach((e) => {
      const staffNames = Array.isArray(e.assignedStaff)
        ? e.assignedStaff.map((s) => (s.name || s)).join("; ")
        : ""
      csv += `${escapeCSV(e.name)},${escapeCSV(new Date(e.date).toLocaleDateString("es-ES"))},${escapeCSV(e.time || "")},${escapeCSV(e.location || "")},${escapeCSV(e.responsible || "")},${escapeCSV(e.description || "")},${escapeCSV(staffNames)}\n`
    })
    csv += "\n"

    // Inventario
    csv += "INVENTARIO\n"
    csv += "Nombre,Tipo,Descripción,Stock,Unidad,Estado,Fecha de Expiración\n"
    inventory.forEach((i) => {
      csv += `${escapeCSV(i.name)},${escapeCSV(i.type)},${escapeCSV(i.description || "")},${escapeCSV(i.stock)},${escapeCSV(i.unit)},${escapeCSV(i.status)},${escapeCSV(i.expirationDate ? new Date(i.expirationDate).toLocaleDateString("es-ES") : "")}\n`
    })
    csv += "\n"

    // Datos Nutricionales
    csv += "DATOS NUTRICIONALES\n"
    csv += "Paciente,Email,Fecha,Peso (kg),Altura (cm),IMC,Notas\n"
    nutritionalData.forEach((n) => {
      csv += `${escapeCSV(n.patientName)},${escapeCSV(n.patientEmail)},${escapeCSV(new Date(n.date).toLocaleDateString("es-ES"))},${escapeCSV(n.weight || "")},${escapeCSV(n.height || "")},${escapeCSV(n.bmi || "")},${escapeCSV(n.notes || "")}\n`
    })

    const filename = `estadisticas-ianet-${new Date().toISOString().split("T")[0]}.csv`
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


