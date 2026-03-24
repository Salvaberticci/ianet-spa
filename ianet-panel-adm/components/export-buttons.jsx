"use client"

import { useState } from "react"
import { FileText, FileSpreadsheet, Download } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "sonner"

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCsvUrl(period, months, start, end) {
    if (period === "range" && start && end) return `/api/admin/stats/export/csv?start=${start}&end=${end}`
    if (period === "month") return `/api/admin/stats/export/csv?period=month&months=${months}`
    return `/api/admin/stats/export/csv?period=${period}`
}

function getDataUrl(period, months, start, end) {
    if (period === "range" && start && end) return `/api/admin/stats/data?start=${start}&end=${end}`
    if (period === "month") return `/api/admin/stats/data?period=month&months=${months}`
    return `/api/admin/stats/data?period=${period}`
}

function humanLabel(period, start, end) {
    if (period === "day") return "Reporte del Día"
    if (period === "week") return "Reporte por Semana"
    if (period === "month") return "Reporte del Mes"
    if (period === "range") return `Reporte por Rango de Fechas (${start} a ${end})`
    return "Reporte Estadístico"
}

// ─── Sub-component: PDF download for a specific period ────────────────────────
function PdfBtn({ label, period, months = 12, start = "", end = "" }) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (period === "range" && (!start || !end)) {
            toast.error("Selecciona una fecha de inicio y fin para el rango.")
            return
        }
        setLoading(true)
        const toastId = toast.loading("Generando PDF...")
        try {
            const res = await fetch(getDataUrl(period, months, start, end))
            if (!res.ok) throw new Error("Error al obtener datos")
            const data = await res.json()

            const doc = new jsPDF()
            const pw = doc.internal.pageSize.getWidth()
            const title = humanLabel(period, start, end)

            doc.setFontSize(18); doc.setTextColor(34, 197, 94)
            doc.text(title.toUpperCase(), pw / 2, 18, { align: "center" })
            doc.setFontSize(10); doc.setTextColor(100)
            doc.text("Instituto de Alimentación y Nutrición del Estado Trujillo", pw / 2, 25, { align: "center" })
            doc.text(`Generado el: ${new Date().toLocaleString("es-ES")}`, pw / 2, 31, { align: "center" })
            doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.8)
            doc.line(14, 35, pw - 14, 35)

            // Summary
            doc.setFontSize(13); doc.setTextColor(34, 197, 94)
            doc.text("Resumen del Período", 14, 50)
            autoTable(doc, {
                startY: 54,
                head: [["Indicador", "Valor"]],
                body: [
                    ["Total de Citas", data.stats.totalAppointments.toString()],
                    ["Citas Médicas", data.stats.medicalAppointments.toString()],
                    ["Citas Nutricionales", data.stats.nutritionalAppointments.toString()],
                    ["Total de Eventos", data.stats.totalEvents.toString()],
                    ["Mensajes de Contacto", data.stats.totalContacts.toString()],
                ],
                theme: "striped", headStyles: { fillColor: [34, 197, 94] },
            })

            // Appointments
            doc.setFontSize(13); doc.setTextColor(34, 197, 94)
            doc.text("Citas", 14, doc.lastAutoTable.finalY + 12)
            const apptRows = data.appointments.map(a => [
                a.patientName,
                a.type === "medica" ? "Médica" : "Nutricional",
                a.status,
                new Date(a.dateTime).toLocaleString("es-ES"),
                a.assignedStaff?.name || "Sin asignar",
            ])
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 16,
                head: [["Paciente", "Tipo", "Estado", "Fecha/Hora", "Personal"]],
                body: apptRows.length ? apptRows : [["Sin registros", "", "", "", ""]],
                theme: "grid", headStyles: { fillColor: [34, 197, 94] }, styles: { fontSize: 8 },
            })

            // Events
            doc.setFontSize(13); doc.setTextColor(124, 58, 237)
            doc.text("Eventos", 14, doc.lastAutoTable.finalY + 12)
            const evtRows = data.events.map(e => [
                e.name, new Date(e.date).toLocaleDateString("es-ES"),
                e.time || "", e.location || "", e.responsible || "",
            ])
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 16,
                head: [["Nombre", "Fecha", "Hora", "Lugar", "Responsable"]],
                body: evtRows.length ? evtRows : [["Sin eventos", "", "", "", ""]],
                theme: "grid", headStyles: { fillColor: [124, 58, 237] }, styles: { fontSize: 8 },
            })

            // Footer
            const pages = doc.internal.getNumberOfPages()
            for (let i = 1; i <= pages; i++) {
                doc.setPage(i); doc.setFontSize(8); doc.setTextColor(160)
                doc.text(`Página ${i} de ${pages} - IANET`, pw / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" })
            }

            doc.save(`reporte-ianet-${period}-${new Date().toISOString().split("T")[0]}.pdf`)
            toast.success("PDF generado exitosamente", { id: toastId })
        } catch (err) {
            toast.error("Error al generar el PDF", { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            title={`Exportar PDF — ${label}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
            <FileText className="w-3.5 h-3.5" />
            {loading ? "Generando..." : "PDF"}
        </button>
    )
}

// ─── Sub-component: CSV download for a specific period ─────────────────────
function CsvBtn({ label, period, months = 12, start = "", end = "" }) {
    const handleClick = () => {
        if (period === "range" && (!start || !end)) {
            toast.error("Selecciona una fecha de inicio y fin para el rango.")
            return
        }
        const url = getCsvUrl(period, months, start, end)
        const a = document.createElement("a")
        a.href = url
        a.download = `estadisticas-ianet-${period}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <button
            onClick={handleClick}
            title={`Exportar CSV — ${label}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-green-600 border border-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors whitespace-nowrap"
        >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV
        </button>
    )
}

// ─── Main export panel ────────────────────────────────────────────────────────
export default function ExportButtons() {
    const defaultEnd = new Date().toISOString().split("T")[0]
    const defaultStart = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]
    const [rangeStart, setRangeStart] = useState(defaultStart)
    const [rangeEnd, setRangeEnd] = useState(defaultEnd)
    const [rangeMonths, setRangeMonths] = useState(12)

    const periods = [
        { period: "day", label: "Reporte del Día", subtitle: "Datos de hoy" },
        { period: "week", label: "Reporte por Semana", subtitle: "Últimos 7 días" },
        { period: "month", label: "Reporte del Mes", subtitle: "Últimos 30 días" },
    ]

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-700">Exportar Reporte</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Day / Week / Month */}
                {periods.map(({ period, label, subtitle }) => (
                    <div key={period} className="border border-gray-100 rounded-xl p-3 space-y-2.5">
                        <div>
                            <p className="text-xs font-semibold text-gray-700">{label}</p>
                            <p className="text-[11px] text-gray-400">{subtitle}</p>
                        </div>



                        <div className="flex gap-2">
                            <CsvBtn label={label} period={period} months={rangeMonths} />
                            <PdfBtn label={label} period={period} months={rangeMonths} />
                        </div>
                    </div>
                ))}

                {/* Range */}
                <div className="border border-gray-100 rounded-xl p-3 space-y-2.5">
                    <div>
                        <p className="text-xs font-semibold text-gray-700">Por Rango</p>
                        <p className="text-[11px] text-gray-400">Fecha personalizada</p>
                    </div>

                    <div className="space-y-1.5">
                        <input
                            type="date"
                            value={rangeStart}
                            onChange={e => setRangeStart(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        <input
                            type="date"
                            value={rangeEnd}
                            onChange={e => setRangeEnd(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <CsvBtn label="Rango" period="range" start={rangeStart} end={rangeEnd} />
                        <PdfBtn label="Rango" period="range" start={rangeStart} end={rangeEnd} />
                    </div>
                </div>

            </div>
        </div>
    )
}
