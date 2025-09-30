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
import { Input } from "@/components/ui/input"
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { Caso } from "@/types/database"
import useAppStore from "@/store/app-store"
import { useToast } from "@/hooks/use-toast"

interface CasosTableProps {
  casos: Caso[]
  onEdit?: (caso: Caso) => void
  onView?: (caso: Caso) => void
  onDelete?: (id: number) => void
}

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'Activo':
      return 'success'
    case 'Cerrado':
      return 'secondary'
    case 'Cancelado':
      return 'destructive'
    case 'Pausado':
      return 'warning'
    default:
      return 'secondary'
  }
}

function getEstadoCasoColor(estado: string) {
  switch (estado) {
    case 'On going':
      return 'info'
    case 'No FEE':
      return 'secondary'
    case 'Para Refacturar':
      return 'warning'
    case 'Refacturado':
      return 'success'
    default:
      return 'secondary'
  }
}

export function CasosTable({ casos, onEdit, onView, onDelete }: CasosTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const { toast } = useToast()
  
  const filteredCasos = casos.filter(caso => 
    caso.nro_caso_assistravel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caso.corresponsal?.nombre_corresponsalia.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este caso?')) {
      onDelete?.(id)
      toast({
        title: 'Caso eliminado',
        description: 'El caso ha sido eliminado exitosamente.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Casos Recientes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar casos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Caso
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nro. Caso</TableHead>
              <TableHead>Corresponsal</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Estado Interno</TableHead>
              <TableHead>Estado del Caso</TableHead>
              <TableHead>FEE</TableHead>
              <TableHead>Acciones</TableHead>
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
                  <Badge variant={getEstadoColor(caso.estado_caso_interno) as any}>
                    {caso.estado_caso_interno}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getEstadoCasoColor(caso.estado_del_caso) as any}>
                    {caso.estado_del_caso}
                  </Badge>
                </TableCell>
                <TableCell>
                  {caso.factura?.fee ? formatCurrency(caso.factura.fee) : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView?.(caso)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(caso)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(caso.id_caso)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredCasos.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No se encontraron casos.
          </div>
        )}
      </CardContent>
    </Card>
  )
}