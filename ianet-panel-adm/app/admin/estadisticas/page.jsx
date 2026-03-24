import { requireAuth } from "@/lib/auth"
import StatsOverview from "@/components/stats-overview"
import StatsCharts from "@/components/stats-charts"
import ExportButtons from "@/components/export-buttons"

export default async function EstadisticasPage() {
  await requireAuth()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Estadísticas</h1>
      </div>

      <div className="space-y-6">

        {/* Export Buttons — top of page, per period */}
        <ExportButtons />

        {/* Summary stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen General</h2>
          <StatsOverview />
        </div>

        {/* Charts with period filter */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gráficas y Evolución</h2>
          <StatsCharts />
        </div>

      </div>
    </div>
  )
}
