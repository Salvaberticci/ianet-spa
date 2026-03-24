"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// ─── Professional colour palettes ───────────────────────────────────────────
const APPOINTMENTS_COLORS = {
  total: "#16a34a", // green-600
  medica: "#2563eb", // blue-600
  nutricional: "#d97706", // amber-600
}

const PIE_COLORS = ["#2563eb", "#d97706", "#16a34a", "#7c3aed", "#db2777"]

const EVENTS_COLOR = "#7c3aed" // violet-600
const PESO_COLOR = "#0891b2" // cyan-600
const IMC_COLOR = "#db2777" // pink-600

// ─── Shared Tooltip style ───────────────────────────────────────────────────
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

// ─── Period filter buttons (Día / Semana / Mes / Rango) ──────────────────────
const PERIOD_OPTIONS = [
  { label: "Día", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
  { label: "Rango", value: "range" },
]

const PeriodFilter = ({
  period,
  onPeriodChange,
  months,
  onMonthsChange,
  customStart,
  onStartChange,
  customEnd,
  onEndChange
}) => (
  <div className="flex items-center gap-3 flex-wrap justify-end">
    {/* Period selector */}
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onPeriodChange(opt.value)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === opt.value
            ? "bg-white text-green-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>

    {/* Month range (only visible for 'month' period) */}
    {period === "month" && (
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {[3, 6, 12].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onMonthsChange(m)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${months === m
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {m} meses
          </button>
        ))}
      </div>
    )}

    {/* Custom Range (only visible for 'range' period) */}
    {period === "range" && (
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 animate-in fade-in slide-in-from-right-2 duration-300">
        <input
          type="date"
          value={customStart}
          onChange={(e) => onStartChange(e.target.value)}
          className="bg-transparent text-xs font-medium text-gray-700 px-2 focus:outline-none"
        />
        <span className="text-gray-400 text-[10px]">&mdash;</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => onEndChange(e.target.value)}
          className="bg-transparent text-xs font-medium text-gray-700 px-2 focus:outline-none"
        />
      </div>
    )}
  </div>
)

// ─── Card wrapper ────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, headerRight, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {headerRight}
    </div>
    {children}
  </div>
)

// ─── Custom pie label ────────────────────────────────────────────────────────
const renderPieLabel = ({ name, percent }) =>
  `${name}: ${(percent * 100).toFixed(0)}%`

// ─── Period subtitle helper ───────────────────────────────────────────────────
function periodSubtitle(period, months, start, end) {
  if (period === "day") return "Últimos 30 días"
  if (period === "week") return "Últimas 16 semanas"
  if (period === "range" && start && end) return `Del ${start} al ${end}`
  return `Últimos ${months} meses`
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function StatsCharts() {
  const [period, setPeriod] = useState("month")
  const [months, setMonths] = useState(12)
  const [customDates, setCustomDates] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let url = `/api/admin/stats/charts?period=${period}`

    if (period === "month") {
      url += `&months=${months}`
    } else if (period === "range") {
      url = `/api/admin/stats/charts?period=day&start=${customDates.start}&end=${customDates.end}`
    }

    fetch(url)
      .then((r) => r.json())
      .then((data) => setChartData(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [period, months, customDates])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-72 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-6" />
            <div className="h-full bg-gray-50 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (!chartData) {
    return <div className="text-gray-400 text-center py-12">Error al cargar datos para gráficas</div>
  }

  // Pie chart data – last data point
  const lastPeriod = chartData.appointmentsByMonth[chartData.appointmentsByMonth.length - 1]
  const pieData = lastPeriod
    ? [
      { name: "Médicas", value: lastPeriod.medica || 0 },
      { name: "Nutricionales", value: lastPeriod.nutricional || 0 },
    ].filter((d) => d.value > 0)
    : []

  const subtitle = periodSubtitle(period, months, customDates.start, customDates.end)

  return (
    <div className="space-y-6">
      {/* Period filter banner */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          Vista por{" "}
          <span className="font-semibold text-gray-700">
            {PERIOD_OPTIONS.find((p) => p.value === period)?.label}
          </span>{" "}
          &mdash; {subtitle}
        </p>
        <PeriodFilter
          period={period}
          onPeriodChange={setPeriod}
          months={months}
          onMonthsChange={setMonths}
          customStart={customDates.start}
          onStartChange={(start) => setCustomDates(prev => ({ ...prev, start }))}
          customEnd={customDates.end}
          onEndChange={(end) => setCustomDates(prev => ({ ...prev, end }))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Citas por período ── */}
        <ChartCard
          title="Citas por Período"
          subtitle="Total, médicas y nutricionales"
        >
          {chartData.appointmentsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData.appointmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => {
                    const labels = { total: "Total", medica: "Médicas", nutricional: "Nutricionales" }
                    return <span style={{ fontSize: 12, color: "#6b7280" }}>{labels[value] || value}</span>
                  }}
                />
                <Bar dataKey="total" name="total" fill={APPOINTMENTS_COLORS.total} radius={[4, 4, 0, 0]} />
                <Bar dataKey="medica" name="medica" fill={APPOINTMENTS_COLORS.medica} radius={[4, 4, 0, 0]} />
                <Bar dataKey="nutricional" name="nutricional" fill={APPOINTMENTS_COLORS.nutricional} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </ChartCard>

        {/* ── Distribución de citas (Pie) ── */}
        <ChartCard
          title="Distribución de Citas"
          subtitle={lastPeriod ? `Último período registrado` : "Sin datos recientes"}
        >
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </ChartCard>

        {/* ── Eventos por período ── */}
        <ChartCard title="Eventos por Período" subtitle="Actividades y eventos institucionales">
          {chartData.eventsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData.eventsByMonth} barCategoryGap="40%">
                <defs>
                  <linearGradient id="gradEvLocal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={EVENTS_COLOR} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={EVENTS_COLOR} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Eventos" fill="url(#gradEvLocal)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty />
          )}
        </ChartCard>

        {/* ── Evolución nutricional ── */}
        <ChartCard title="Evolución Nutricional" subtitle="Promedios de peso e IMC (por mes)">
          {chartData.nutritionalByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData.nutritionalByMonth}>
                <defs>
                  <linearGradient id="areaPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PESO_COLOR} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={PESO_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ fontSize: 12, color: "#6b7280" }}>{v}</span>} />
                <Line
                  type="monotone"
                  dataKey="pesoPromedio"
                  name="Peso promedio (kg)"
                  stroke={PESO_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: PESO_COLOR, stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="imcPromedio"
                  name="IMC promedio"
                  stroke={IMC_COLOR}
                  strokeWidth={2.5}
                  strokeDasharray="6 3"
                  dot={{ r: 4, fill: IMC_COLOR, stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty msg="No hay datos nutricionales disponibles" />
          )}
        </ChartCard>

      </div>
    </div>
  )
}

const Empty = ({ msg = "No hay datos disponibles" }) => (
  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">{msg}</div>
)
