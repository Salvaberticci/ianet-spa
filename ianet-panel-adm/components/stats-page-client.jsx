"use client"

import { useState, useEffect } from "react"
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { FileText, FileSpreadsheet } from "lucide-react"
import PdfReportButton from "@/components/pdf-report-button"

// ─── Professional colour palettes ───────────────────────────────────────────
const APPOINTMENTS_COLORS = {
    total: "#16a34a",
    medica: "#2563eb",
    nutricional: "#d97706",
}
const PIE_COLORS = ["#2563eb", "#d97706", "#16a34a", "#7c3aed", "#db2777"]
const EVENTS_COLOR = "#7c3aed"
const PESO_COLOR = "#0891b2"
const IMC_COLOR = "#db2777"

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
            {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
            {payload.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                    <span className="text-gray-600">{entry.name}:</span>
                    <span className="font-medium text-gray-800">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

const PERIOD_OPTIONS = [
    { label: "Día", value: "day" },
    { label: "Semana", value: "week" },
    { label: "Mes", value: "month" },
    { label: "Rango", value: "range" },
]

const ChartCard = ({ title, subtitle, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {children}
    </div>
)

const renderPieLabel = ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`

const Empty = ({ msg = "No hay datos disponibles" }) => (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">{msg}</div>
)

function getDefaultDates() {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 7)
    return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
    }
}

function periodSubtitle(period, months, start, end) {
    if (period === "day") return "Últimos 30 días"
    if (period === "week") return "Últimas 16 semanas"
    if (period === "range" && start && end) return `Del ${start} al ${end}`
    return `Últimos ${months} meses`
}

export default function StatsPageClient() {
    const [period, setPeriod] = useState("month")
    const [months, setMonths] = useState(12)
    const [customDates, setCustomDates] = useState(getDefaultDates)
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        let url = `/api/admin/stats/charts?period=${period}`
        if (period === "month") url += `&months=${months}`
        else if (period === "range") url = `/api/admin/stats/charts?period=day&start=${customDates.start}&end=${customDates.end}`

        fetch(url).then(r => r.json()).then(setChartData).catch(console.error).finally(() => setLoading(false))
    }, [period, months, customDates])

    // Build export URLs matching the current filter
    const csvUrl = period === "range"
        ? `/api/admin/stats/export/csv?start=${customDates.start}&end=${customDates.end}`
        : period === "month"
            ? `/api/admin/stats/export/csv?period=${period}&months=${months}`
            : `/api/admin/stats/export/csv?period=${period}`

    const subtitle = periodSubtitle(period, months, customDates.start, customDates.end)

    return (
        <div className="space-y-6">

            {/* ── Export & Filter Bar ── */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                {/* Left: period info */}
                <p className="text-sm text-gray-500">
                    Vista por{" "}
                    <span className="font-semibold text-gray-700">
                        {PERIOD_OPTIONS.find(p => p.value === period)?.label}
                    </span>
                    {" "}&mdash; {subtitle}
                </p>

                {/* Right: filters + exports */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Period buttons */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        {PERIOD_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setPeriod(opt.value)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === opt.value ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >{opt.label}</button>
                        ))}
                    </div>

                    {/* Month range */}
                    {period === "month" && (
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {[3, 6, 12].map(m => (
                                <button key={m} type="button" onClick={() => setMonths(m)}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${months === m ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >{m} meses</button>
                            ))}
                        </div>
                    )}

                    {/* Custom range inputs */}
                    {period === "range" && (
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <input type="date" value={customDates.start}
                                onChange={e => setCustomDates(prev => ({ ...prev, start: e.target.value }))}
                                className="bg-transparent text-xs font-medium text-gray-700 px-2 focus:outline-none"
                            />
                            <span className="text-gray-400 text-[10px]">&mdash;</span>
                            <input type="date" value={customDates.end}
                                onChange={e => setCustomDates(prev => ({ ...prev, end: e.target.value }))}
                                className="bg-transparent text-xs font-medium text-gray-700 px-2 focus:outline-none"
                            />
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200" />

                    {/* CSV Export */}
                    <a
                        href={csvUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-xl hover:bg-green-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Exportar CSV
                    </a>

                    {/* PDF Export */}
                    <PdfReportButton
                        period={period}
                        months={months}
                        start={customDates.start}
                        end={customDates.end}
                    />
                </div>
            </div>

            {/* ── Charts ── */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-72 animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-1/3 mb-6" />
                            <div className="h-full bg-gray-50 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : !chartData ? (
                <div className="text-gray-400 text-center py-12">Error al cargar datos para gráficas</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Citas por período */}
                    <ChartCard title="Citas por Período" subtitle={`Total, médicas y nutricionales — ${subtitle}`}>
                        {chartData.appointmentsByMonth.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData.appointmentsByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend formatter={(value) => {
                                        const labels = { total: "Total", medica: "Médicas", nutricional: "Nutricionales" }
                                        return <span style={{ fontSize: 12, color: "#6b7280" }}>{labels[value] || value}</span>
                                    }} />
                                    <Bar dataKey="total" name="total" fill={APPOINTMENTS_COLORS.total} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="medica" name="medica" fill={APPOINTMENTS_COLORS.medica} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="nutricional" name="nutricional" fill={APPOINTMENTS_COLORS.nutricional} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <Empty />}
                    </ChartCard>

                    {/* Distribución Pie */}
                    {(() => {
                        const lastPeriod = chartData.appointmentsByMonth[chartData.appointmentsByMonth.length - 1]
                        const pieData = lastPeriod
                            ? [{ name: "Médicas", value: lastPeriod.medica || 0 }, { name: "Nutricionales", value: lastPeriod.nutricional || 0 }].filter(d => d.value > 0)
                            : []
                        return (
                            <ChartCard title="Distribución de Citas" subtitle={lastPeriod ? "Último período registrado" : "Sin datos recientes"}>
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                                                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="white" strokeWidth={2} />)}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend formatter={v => <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <Empty />}
                            </ChartCard>
                        )
                    })()}

                    {/* Eventos por período */}
                    <ChartCard title="Eventos por Período" subtitle="Actividades y eventos institucionales">
                        {chartData.eventsByMonth.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={chartData.eventsByMonth} barCategoryGap="40%">
                                    <defs>
                                        <linearGradient id="gradEv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={EVENTS_COLOR} stopOpacity={0.9} />
                                            <stop offset="95%" stopColor={EVENTS_COLOR} stopOpacity={0.5} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="total" name="Eventos" fill="url(#gradEv)" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <Empty />}
                    </ChartCard>

                    {/* Evolución nutricional */}
                    <ChartCard title="Evolución Nutricional" subtitle="Promedios de peso e IMC (por mes)">
                        {chartData.nutritionalByMonth.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={chartData.nutritionalByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend formatter={v => <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>} />
                                    <Line type="monotone" dataKey="pesoPromedio" name="Peso promedio (kg)" stroke={PESO_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: PESO_COLOR, stroke: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="imcPromedio" name="IMC promedio" stroke={IMC_COLOR} strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4, fill: IMC_COLOR, stroke: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <Empty msg="No hay datos nutricionales disponibles" />}
                    </ChartCard>

                </div>
            )}
        </div>
    )
}
