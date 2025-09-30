"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Edit, Trash2, Plus, Search, ExternalLink } from "lucide-react"
import { FormularioCorresponsal } from "@/components/forms/formulario-corresponsal"
import { MetricCard } from "@/components/dashboard/metric-card"
import useAppStore from "@/store/app-store"
import { useToast } from "@/hooks/use-toast"
import type { Corresponsal } from "@/types/database"

export default function CorresponsalesPage() {
  const [showDialog, setShowDialog] = React.useState(false)
  const [editingCorresponsal, setEditingCorresponsal] = React.useState<Corresponsal | undefined>()
  const [searchTerm, setSearchTerm] = React.useState('')
  const { 
    corresponsales, 
    casos, 
    metrics,
    fetchCorresponsales, 
    deleteCorresponsal,
    fetchMetrics 
  } = useAppStore()
  const { toast } = useToast()

  React.useEffect(() => {
    fetchCorresponsales()
    fetchMetrics()
  }, [])

  const filteredCorresponsales = corresponsales.filter(corresponsal => 
    corresponsal.nombre_corresponsalia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corresponsal.nombre_contacto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corresponsal.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (corresponsal: Corresponsal) => {
    setEditingCorresponsal(corresponsal)
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este corresponsal?')) {
      try {
        await deleteCorresponsal(id)
        await fetchMetrics()
        toast({
          title: 'Corresponsal eliminado',
          description: 'El corresponsal ha sido eliminado exitosamente.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el corresponsal.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleSuccess = () => {
    setShowDialog(false)
    setEditingCorresponsal(undefined)
    fetchCorresponsales()
    fetchMetrics()
  }

  const handleCancel = () => {
    setShowDialog(false)
    setEditingCorresponsal(undefined)
  }

  const getCorresponsalCasosCount = (correspondId: number) => {
    return casos.filter(caso => caso.id_corresponsal === correspondId).length
  }

  const getCorresponsalCasosActivos = (correspondId: number) => {
    return casos.filter(caso => 
      caso.id_corresponsal === correspondId && caso.estado_caso_interno === 'Activo'
    ).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Corresponsales</h1>
          <p className="text-muted-foreground">
            Administra la información de todos los corresponsales
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCorresponsal(undefined)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Corresponsal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCorresponsal ? 'Editar Corresponsal' : 'Crear Nuevo Corresponsal'}
              </DialogTitle>
              <DialogDescription>
                {editingCorresponsal 
                  ? 'Modifica la información del corresponsal existente.' 
                  : 'Complete la información para crear un nuevo corresponsal.'
                }
              </DialogDescription>
            </DialogHeader>
            <FormularioCorresponsal
              corresponsal={editingCorresponsal}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Corresponsales"
          value={metrics?.totalCorresponsales || 0}
          icon={<Plus className="h-4 w-4" />}
        />
        <MetricCard
          title="Corresponsales con Casos Activos"
          value={metrics?.corresponsalesConCasosActivos || 0}
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Promedio Casos por Corresponsal"
          value={corresponsales.length > 0 
            ? Math.round(casos.length / corresponsales.length * 10) / 10 
            : 0
          }
          icon={<Edit className="h-4 w-4" />}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Corresponsales</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar corresponsales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Corresponsalía</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Casos Totales</TableHead>
                <TableHead>Casos Activos</TableHead>
                <TableHead>Página Web</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCorresponsales.map((corresponsal) => {
                const casosCount = getCorresponsalCasosCount(corresponsal.id_corresponsal)
                const casosActivos = getCorresponsalCasosActivos(corresponsal.id_corresponsal)
                
                return (
                  <TableRow key={corresponsal.id_corresponsal}>
                    <TableCell className="font-medium">
                      {corresponsal.nombre_corresponsalia}
                    </TableCell>
                    <TableCell>
                      {corresponsal.nombre_contacto || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {corresponsal.telefono || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {corresponsal.correo || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {casosCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={casosActivos > 0 ? "success" : "secondary"}>
                        {casosActivos}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {corresponsal.pagina_web ? (
                        <a 
                          href={corresponsal.pagina_web} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Sitio web
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(corresponsal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(corresponsal.id_corresponsal)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredCorresponsales.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No se encontraron corresponsales.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}