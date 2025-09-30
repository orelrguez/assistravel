"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { generateCaseNumber } from "@/lib/utils"
import type { CreateCasoForm, Caso, Corresponsal } from "@/types/database"
import useAppStore from "@/store/app-store"
import { useToast } from "@/hooks/use-toast"
import { FormularioCorresponsal } from "./formulario-corresponsal"

const casoSchema = z.object({
  id_corresponsal: z.number().min(1, "Debe seleccionar un corresponsal"),
  nro_caso_assistravel: z.string().min(1, "Número de caso requerido"),
  nro_caso_corresponsal: z.string().optional(),
  fecha_inicio_caso: z.string().min(1, "Fecha de inicio requerida"),
  estado_caso_interno: z.enum(['Activo', 'Cerrado', 'Cancelado', 'Pausado']),
  estado_del_caso: z.enum(['On going', 'No FEE', 'Para Refacturar', 'Refacturado']),
  im_informe_medico: z.boolean(),
  observaciones: z.string().optional(),
  // Factura fields
  tiene_factura: z.boolean(),
  fee: z.number().optional(),
  costo_usd: z.number().optional(),
  costo_moneda_local: z.number().optional(),
  fecha_emision: z.string().optional(),
  fecha_vto: z.string().optional(),
  fecha_pago: z.string().optional(),
  nro_de_factura: z.string().optional(),
  monto_agregado: z.number().optional(),
  observaciones_factura: z.string().optional(),
})

interface FormularioCasoProps {
  caso?: Caso
  onSuccess?: () => void
  onCancel?: () => void
}

export function FormularioCaso({ caso, onSuccess, onCancel }: FormularioCasoProps) {
  const [showCorresponsalDialog, setShowCorresponsalDialog] = React.useState(false)
  const { 
    corresponsales, 
    createCaso, 
    updateCaso, 
    fetchCorresponsales, 
    loading 
  } = useAppStore()
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCasoForm>({
    resolver: zodResolver(casoSchema),
    defaultValues: {
      nro_caso_assistravel: caso?.nro_caso_assistravel || generateCaseNumber(),
      id_corresponsal: caso?.id_corresponsal || 0,
      nro_caso_corresponsal: caso?.nro_caso_corresponsal || '',
      fecha_inicio_caso: caso?.fecha_inicio_caso || new Date().toISOString().split('T')[0],
      estado_caso_interno: caso?.estado_caso_interno || 'Activo',
      estado_del_caso: caso?.estado_del_caso || 'On going',
      im_informe_medico: caso?.im_informe_medico || false,
      observaciones: caso?.observaciones || '',
      tiene_factura: caso?.factura?.tiene_factura || false,
      fee: caso?.factura?.fee || undefined,
      costo_usd: caso?.factura?.costo_usd || undefined,
      costo_moneda_local: caso?.factura?.costo_moneda_local || undefined,
      fecha_emision: caso?.factura?.fecha_emision || '',
      fecha_vto: caso?.factura?.fecha_vto || '',
      fecha_pago: caso?.factura?.fecha_pago || '',
      nro_de_factura: caso?.factura?.nro_de_factura || '',
      monto_agregado: caso?.factura?.monto_agregado || undefined,
      observaciones_factura: caso?.factura?.observaciones_factura || '',
    },
  })

  const tieneFactura = watch('tiene_factura')

  React.useEffect(() => {
    fetchCorresponsales()
  }, [])

  const onSubmit = async (data: CreateCasoForm) => {
    try {
      if (caso) {
        await updateCaso(caso.id_caso, data)
        toast({
          title: 'Caso actualizado',
          description: 'El caso ha sido actualizado exitosamente.',
        })
      } else {
        await createCaso(data)
        toast({
          title: 'Caso creado',
          description: 'El caso ha sido creado exitosamente.',
        })
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el caso.',
        variant: 'destructive',
      })
    }
  }

  const handleCorresponsalCreated = (corresponsal: Corresponsal) => {
    setValue('id_corresponsal', corresponsal.id_corresponsal)
    setShowCorresponsalDialog(false)
    toast({
      title: 'Corresponsal creado',
      description: 'El corresponsal ha sido creado y seleccionado.',
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Detalles del Caso */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Caso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nro_caso_assistravel">Número de Caso ASSISTRAVEL</Label>
              <Input
                id="nro_caso_assistravel"
                {...register('nro_caso_assistravel')}
                disabled={!!caso}
              />
              {errors.nro_caso_assistravel && (
                <p className="text-sm text-red-500">{errors.nro_caso_assistravel.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nro_caso_corresponsal">Número de Caso Corresponsal</Label>
              <Input
                id="nro_caso_corresponsal"
                {...register('nro_caso_corresponsal')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio_caso">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio_caso"
                type="date"
                {...register('fecha_inicio_caso')}
              />
              {errors.fecha_inicio_caso && (
                <p className="text-sm text-red-500">{errors.fecha_inicio_caso.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Informe Médico</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={watch('im_informe_medico')}
                  onCheckedChange={(checked) => setValue('im_informe_medico', checked)}
                />
                <span className="text-sm">
                  {watch('im_informe_medico') ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado Caso Interno</Label>
              <Select 
                value={watch('estado_caso_interno')} 
                onValueChange={(value) => setValue('estado_caso_interno', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado del Caso</Label>
              <Select 
                value={watch('estado_del_caso')} 
                onValueChange={(value) => setValue('estado_del_caso', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On going">On going</SelectItem>
                  <SelectItem value="No FEE">No FEE</SelectItem>
                  <SelectItem value="Para Refacturar">Para Refacturar</SelectItem>
                  <SelectItem value="Refacturado">Refacturado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información del Corresponsal */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Corresponsal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Corresponsal</Label>
            <div className="flex space-x-2">
              <Select 
                value={watch('id_corresponsal')?.toString()} 
                onValueChange={(value) => setValue('id_corresponsal', parseInt(value))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar corresponsal" />
                </SelectTrigger>
                <SelectContent>
                  {corresponsales.map((corresponsal) => (
                    <SelectItem 
                      key={corresponsal.id_corresponsal} 
                      value={corresponsal.id_corresponsal.toString()}
                    >
                      {corresponsal.nombre_corresponsalia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={showCorresponsalDialog} onOpenChange={setShowCorresponsalDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Corresponsal</DialogTitle>
                    <DialogDescription>
                      Complete la información del nuevo corresponsal.
                    </DialogDescription>
                  </DialogHeader>
                  <FormularioCorresponsal
                    onSuccess={handleCorresponsalCreated}
                    onCancel={() => setShowCorresponsalDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {errors.id_corresponsal && (
              <p className="text-sm text-red-500">{errors.id_corresponsal.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información de Facturación */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Facturación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={tieneFactura}
              onCheckedChange={(checked) => setValue('tiene_factura', checked)}
            />
            <Label>Tiene Factura</Label>
          </div>

          {tieneFactura ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee">FEE</Label>
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    {...register('fee', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="costo_usd">Costo USD</Label>
                  <Input
                    id="costo_usd"
                    type="number"
                    step="0.01"
                    {...register('costo_usd', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="costo_moneda_local">Costo Moneda Local</Label>
                  <Input
                    id="costo_moneda_local"
                    type="number"
                    step="0.01"
                    {...register('costo_moneda_local', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_emision">Fecha Emisión</Label>
                  <Input
                    id="fecha_emision"
                    type="date"
                    {...register('fecha_emision')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fecha_vto">Fecha Vencimiento</Label>
                  <Input
                    id="fecha_vto"
                    type="date"
                    {...register('fecha_vto')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fecha_pago">Fecha Pago</Label>
                  <Input
                    id="fecha_pago"
                    type="date"
                    {...register('fecha_pago')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nro_de_factura">Número de Factura</Label>
                  <Input
                    id="nro_de_factura"
                    {...register('nro_de_factura')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monto_agregado">Monto Agregado</Label>
                  <Input
                    id="monto_agregado"
                    type="number"
                    step="0.01"
                    {...register('monto_agregado', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones_factura">Observaciones Factura</Label>
                <Textarea
                  id="observaciones_factura"
                  {...register('observaciones_factura')}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Información de facturación no disponible aún</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting ? 'Guardando...' : caso ? 'Actualizar Caso' : 'Crear Caso'}
        </Button>
      </div>
    </form>
  )
}