"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CasosTable } from "@/components/dashboard/casos-table"
import { FormularioCaso } from "@/components/forms/formulario-caso"
import useAppStore from "@/store/app-store"
import type { Caso } from "@/types/database"

export default function CasosPage() {
  const [showDialog, setShowDialog] = React.useState(false)
  const [editingCaso, setEditingCaso] = React.useState<Caso | undefined>()
  const { casos, fetchCasos, deleteCaso, fetchMetrics } = useAppStore()

  React.useEffect(() => {
    fetchCasos()
  }, [])

  const handleEdit = (caso: Caso) => {
    setEditingCaso(caso)
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    await deleteCaso(id)
    await fetchMetrics()
  }

  const handleSuccess = () => {
    setShowDialog(false)
    setEditingCaso(undefined)
    fetchCasos()
    fetchMetrics()
  }

  const handleCancel = () => {
    setShowDialog(false)
    setEditingCaso(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Casos</h1>
          <p className="text-muted-foreground">
            Administra todos los casos de ASSISTRAVEL
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCaso(undefined)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Caso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCaso ? 'Editar Caso' : 'Crear Nuevo Caso'}
              </DialogTitle>
              <DialogDescription>
                {editingCaso 
                  ? 'Modifica la información del caso existente.' 
                  : 'Complete la información para crear un nuevo caso.'
                }
              </DialogDescription>
            </DialogHeader>
            <FormularioCaso
              caso={editingCaso}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CasosTable 
        casos={casos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}