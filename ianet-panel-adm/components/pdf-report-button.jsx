"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "sonner"

function buildDataUrl({ period, months, start, end }) {
    if (period === "range" && start && end) {
        return `/api/admin/stats/data?start=${start}&end=${end}`
    }
    if (period === "month") {
        return `/api/admin/stats/data?period=${period}&months=${months}`
    }
    return `/api/admin/stats/data?period=${period}`
}

function periodLabel({ period, months, start, end }) {
    if (period === "day") return "Últimos 30 días"
    if (period === "week") return "Últimas 16 semanas"
    if (period === "range" && start && end) return `Del ${start} al ${end}`
    return `Últimos ${months} meses`
}

export default function PdfReportButton({ period = "month", months = 12, start = "", end = "" }) {
    const [loading, setLoading] = useState(false)

    const generatePdf = async () => {
        setLoading(true)
        const toastId = toast.loading("Generando reporte PDF...")

        try {
            const url = buildDataUrl({ period, months, start, end })
            const res = await fetch(url)
            if (!res.ok) throw new Error("Error al obtener datos")
            const data = await res.json()

            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()

            // Header
            doc.setFontSize(20)
            doc.setTextColor(34, 197, 94)
            doc.text("ESTADÍSTICAS GENERALES IANET", pageWidth / 2, 20, { align: "center" })

            doc.setFontSize(11)
            doc.setTextColor(100)
            doc.text("Instituto de Alimentación y Nutrición del Estado Trujillo", pageWidth / 2, 28, { align: "center" })
            doc.text(`Período: ${periodLabel({ period, months, start, end })}`, pageWidth / 2, 35, { align: "center" })
            doc.text(`Generado el: ${new Date().toLocaleString("es-ES")}`, pageWidth / 2, 41, { align: "center" })

            doc.setDrawColor(34, 197, 94)
            doc.setLineWidth(1)
            doc.line(20, 46, pageWidth - 20, 46)

            // Stats Summary
            doc.setFontSize(14)
            doc.setTextColor(34, 197, 94)
            doc.text("Resumen del Período", 20, 56)

            const summaryData = [
                ["Total de Citas", data.stats.totalAppointments.toString()],
                ["Citas Médicas", data.stats.medicalAppointments.toString()],
                ["Citas Nutricionales", data.stats.nutritionalAppointments.toString()],
                ["Total de Eventos", data.stats.totalEvents.toString()],
                ["Mensajes de Contacto", data.stats.totalContacts.toString()],
            ]

            autoTable(doc, {
                startY: 61,
                head: [["Indicador", "Valor"]],
                body: summaryData,
                theme: "striped",
                headStyles: { fillColor: [34, 197, 94] },
            })

            // Appointments Table
            doc.setFontSize(14)
            doc.setTextColor(34, 197, 94)
            doc.text("Reporte de Citas", 20, doc.lastAutoTable.finalY + 14)

            const appointmentRows = data.appointments.map(a => [
                a.patientName,
                a.type === "medica" ? "Médica" : "Nutricional",
                a.status,
                new Date(a.dateTime).toLocaleString("es-ES"),
                a.assignedStaff?.name || "Sin asignar"
            ])

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 19,
                head: [["Paciente", "Tipo", "Estado", "Fecha/Hora", "Personal"]],
                body: appointmentRows.length > 0 ? appointmentRows : [["Sin registros en el período", "", "", "", ""]],
                theme: "grid",
                headStyles: { fillColor: [34, 197, 94] },
                styles: { fontSize: 8 },
            })

            // Events table
            doc.setFontSize(14)
            doc.setTextColor(124, 58, 237)
            doc.text("Eventos del Período", 20, doc.lastAutoTable.finalY + 14)

            const eventRows = data.events.map(e => [
                e.name,
                new Date(e.date).toLocaleDateString("es-ES"),
                e.time || "",
                e.location || "",
                e.responsible || "",
            ])

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 19,
                head: [["Nombre", "Fecha", "Hora", "Lugar", "Responsable"]],
                body: eventRows.length > 0 ? eventRows : [["Sin eventos en el período", "", "", "", ""]],
                theme: "grid",
                headStyles: { fillColor: [124, 58, 237] },
                styles: { fontSize: 8 },
            })

            // Footer
            const pageCount = doc.internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(9)
                doc.setTextColor(150)
                doc.text(
                    `Página ${i} de ${pageCount} - IANET Sistema de Gestión`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: "center" }
                )
            }

            doc.save(`reporte-ianet-${new Date().toISOString().split("T")[0]}.pdf`)
            toast.success("Reporte PDF generado exitosamente", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Error al generar el PDF", { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={generatePdf}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
            <FileText className="w-5 h-5" />
            {loading ? "Generando..." : "Exportar PDF"}
        </button>
    )
}
