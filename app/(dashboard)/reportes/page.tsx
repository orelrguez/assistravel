"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Download, FileText, TrendingUp, DollarSign } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { MetricCard } from "@/components/dashboard/metric-card"
import useAppStore from "@/store/app-store"
import type { Caso } from "@/types/database"

export default function ReportesPage() {
  const [filtroEstado, setFiltroEstado] = React.useState<string>('todos')
  const [filtroTiempo, setFiltroTiempo] = React.useState<string>('mes')
  const { casos, corresponsales, fetchCasos, fetchCorresponsales } = useAppStore()

  React.useEffect(() => {
    fetchCasos()
    fetchCorresponsales()
  }, [])

  // Filter cases based on selected filters
  const filteredCasos = casos.filter(caso => {
    if (filtroEstado !== 'todos' && caso.estado_caso_interno !== filtroEstado) {
      return false
    }
    
    if (filtroTiempo !== 'todos') {
      const casoDate = new Date(caso.fecha_inicio_caso)
      const now = new Date()
      const diffTime = now.getTime() - casoDate.getTime()
      const diffDays = diffTime / (1000 * 3600 * 24)
      
      switch (filtroTiempo) {
        case 'semana':
          return diffDays <= 7
        case 'mes':
          return diffDays <= 30
        case 'trimestre':
          return diffDays <= 90
        case 'año':
          return diffDays <= 365
        default:
          return true
      }
    }
    
    return true
  })

  // Calculate report metrics
  const reportMetrics = {
    totalCasos: filteredCasos.length,
    casosActivos: filteredCasos.filter(c => c.estado_caso_interno === 'Activo').length,
    totalFees: filteredCasos.reduce((sum, c) => sum + (c.factura?.fee || 0), 0),
    totalCostosUSD: filteredCasos.reduce((sum, c) => sum + (c.factura?.costo_usd || 0), 0),
  }

  const exportToCSV = () => {
    const headers = [
      'Numero Caso',
      'Corresponsal',
      'Fecha Inicio',
      'Estado Interno',
      'Estado del Caso',
      'FEE',
      'Costo USD',
      'Observaciones'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredCasos.map(caso => [
        caso.nro_caso_assistravel,
        caso.corresponsal?.nombre_corresponsalia || '',
        caso.fecha_inicio_caso,
        caso.estado_caso_interno,
        caso.estado_del_caso,
        caso.factura?.fee || '',
        caso.factura?.costo_usd || '',
        `"${caso.observaciones || ''}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reporte_casos_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y reportes de casos y corresponsales
          </p>
        </div>
        
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado del Caso</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={filtroTiempo} onValueChange={setFiltroTiempo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todo el tiempo</SelectItem>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mes</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="año">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Casos"
          value={reportMetrics.totalCasos}
          icon={<FileText className="h-4 w-4" />}
        />
        <MetricCard
          title="Casos Activos"
          value={reportMetrics.casosActivos}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Total FEEs"
          value={reportMetrics.totalFees}
          icon={<DollarSign className="h-4 w-4" />}
          currency
        />
        <MetricCard
          title="Total Costos USD"
          value={reportMetrics.totalCostosUSD}
          icon={<DollarSign className="h-4 w-4" />}
          currency
        />
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Casos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nro. Caso</TableHead>
                <TableHead>Corresponsal</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>FEE</TableHead>
                <TableHead>Costo USD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCasos.map((caso) => (
                <TableRow key={caso.id_caso}>
                  <TableCell className="font-medium">
                    {caso.nro_caso_assistravel}
                  </TableCell>
                  <TableCell>
                    {caso.corresponsal?.nombre_corresponsalia || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {formatDate(caso.fecha_inicio_caso)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={caso.estado_caso_interno === 'Activo' ? 'success' : 'secondary'}>
                      {caso.estado_caso_interno}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {caso.factura?.fee ? formatCurrency(caso.factura.fee) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {caso.factura?.costo_usd ? formatCurrency(caso.factura.costo_usd) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCasos.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No se encontraron casos con los filtros seleccionados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}