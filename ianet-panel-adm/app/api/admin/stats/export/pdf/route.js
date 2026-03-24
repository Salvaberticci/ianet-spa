import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import Event from "@/models/Event"
import Inventory from "@/models/Inventory"
import Contact from "@/models/Contact"
import NutritionalData from "@/models/NutritionalData"
import Staff from "@/models/Staff"

export async function GET(request) {
  try {
    await requireAuth()
    await dbConnect()

    const [appointments, events, inventory, contacts, nutritionalData] = await Promise.all([
      Appointment.find().populate("assignedStaff").sort({ dateTime: -1 }).lean(),
      Event.find().populate("assignedStaff").sort({ date: -1 }).lean(),
      Inventory.find().lean(),
      Contact.find().sort({ createdAt: -1 }).lean(),
      NutritionalData.find().sort({ date: -1 }).lean(),
    ])

    const stats = {
      totalAppointments: appointments.length,
      medicalAppointments: appointments.filter((a) => a.type === "medica").length,
      nutritionalAppointments: appointments.filter((a) => a.type === "nutricional").length,
      totalEvents: events.length,
      totalInventory: inventory.length,
      activeInventory: inventory.filter((i) => i.status === "activo").length,
      totalContacts: contacts.length,
      newContacts: contacts.filter((c) => c.status === "nuevo").length,
      totalNutritionalRecords: nutritionalData.length,
    }

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estadísticas IANET</title>
  <style>
    @media print {
      @page {
        size: A4;
        margin: 1.5cm;
      }
      body {
        margin: 0;
      }
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #22c55e;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #22c55e;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #22c55e;
      border-bottom: 2px solid #22c55e;
      padding-bottom: 10px;
      margin-bottom: 15px;
      font-size: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #22c55e;
    }
    .stat-card strong {
      display: block;
      font-size: 24px;
      color: #22c55e;
      margin-bottom: 5px;
    }
    .stat-card span {
      color: #666;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 12px;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #22c55e;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ESTADÍSTICAS GENERALES</h1>
    <h2>Instituto de Alimentación y Nutrición del Estado Trujillo</h2>
    <p>Generado el: ${new Date().toLocaleString("es-ES")}</p>
  </div>

  <div class="section">
    <h2>Resumen General</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <strong>${stats.totalAppointments}</strong>
        <span>Total de Citas</span>
      </div>
      <div class="stat-card">
        <strong>${stats.medicalAppointments}</strong>
        <span>Citas Médicas</span>
      </div>
      <div class="stat-card">
        <strong>${stats.nutritionalAppointments}</strong>
        <span>Citas Nutricionales</span>
      </div>
      <div class="stat-card">
        <strong>${stats.totalEvents}</strong>
        <span>Total de Eventos</span>
      </div>
      <div class="stat-card">
        <strong>${stats.totalInventory}</strong>
        <span>Productos en Inventario</span>
      </div>
      <div class="stat-card">
        <strong>${stats.activeInventory}</strong>
        <span>Productos Activos</span>
      </div>
      <div class="stat-card">
        <strong>${stats.totalContacts}</strong>
        <span>Mensajes de Contacto</span>
      </div>
      <div class="stat-card">
        <strong>${stats.newContacts}</strong>
        <span>Mensajes Nuevos</span>
      </div>
      <div class="stat-card">
        <strong>${stats.totalNutritionalRecords}</strong>
        <span>Registros Nutricionales</span>
      </div>
    </div>
  </div>

    <div class="section">
    <h2>Reporte de Citas</h2>
    <table>
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Fecha/Hora</th>
          <th>Personal</th>
        </tr>
      </thead>
      <tbody>
        ${appointments.map((a) => `
          <tr>
            <td>${a.patientName}</td>
            <td>${a.type}</td>
            <td>${a.status}</td>
            <td>${new Date(a.dateTime).toLocaleString("es-ES")}</td>
            <td>${a.assignedStaff?.name || "Sin asignar"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Reporte de Eventos</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Lugar</th>
          <th>Responsable</th>
        </tr>
      </thead>
      <tbody>
        ${events.map((e) => `
          <tr>
            <td>${e.name}</td>
            <td>${new Date(e.date).toLocaleDateString("es-ES")}</td>
            <td>${e.location || "-"}</td>
            <td>${e.responsible || "-"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Documento generado automáticamente por el Sistema de Gestión IANET</p>
    <p>Para más información, consulte el panel de administración</p>
  </div>

  <script>
    window.onload = () => {
      setTimeout(() => {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="estadisticas-ianet-${new Date().toISOString().split("T")[0]}.html"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

