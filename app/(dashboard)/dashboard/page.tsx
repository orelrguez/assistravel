"use client"

import * as React from "react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { CasosTable } from "@/components/dashboard/casos-table"
import { 
  FileText, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Building2,
  Users
} from "lucide-react"
import useAppStore from "@/store/app-store"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { 
    casos, 
    metrics, 
    loading, 
    fetchCasos, 
    fetchMetrics, 
    deleteCaso 
  } = useAppStore()
  const { toast } = useToast()

  React.useEffect(() => {
    fetchCasos()
    fetchMetrics()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteCaso(id)
      await fetchMetrics() // Refresh metrics after deletion
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el caso.',
        variant: 'destructive',
      })
    }
  }

  if (loading && !casos.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de la gestión de casos ASSISTRAVEL
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Casos Activos"
          value={metrics?.casosActivos || 0}
          icon={<FileText className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Pendientes de Facturar"
          value={metrics?.casosPendientesFacturar || 0}
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: -5, isPositive: false }}
        />
        <MetricCard
          title="FEE Total Pendiente"
          value={metrics?.feeTotalPendiente || 0}
          icon={<DollarSign className="h-4 w-4" />}
          currency
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Costo USD Total"
          value={metrics?.costoUsdTotalEstimado || 0}
          icon={<TrendingUp className="h-4 w-4" />}
          currency
          trend={{ value: 3, isPositive: true }}
        />
        <MetricCard
          title="Total Corresponsales"
          value={metrics?.totalCorresponsales || 0}
          icon={<Building2 className="h-4 w-4" />}
          trend={{ value: 0 }}
        />
        <MetricCard
          title="Corresponsales Activos"
          value={metrics?.corresponsalesConCasosActivos || 0}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Cases Table */}
      <CasosTable 
        casos={casos.slice(0, 10)} // Show only recent 10 cases
        onDelete={handleDelete}
      />
    </div>
  )
}