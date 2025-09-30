"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreateCorresponsalForm, Corresponsal } from "@/types/database"
import useAppStore from "@/store/app-store"
import { useToast } from "@/hooks/use-toast"

const corresponsalSchema = z.object({
  nombre_corresponsalia: z.string().min(1, "Nombre de corresponsalía requerido"),
  nombre_contacto: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email("Email inválido").optional().or(z.literal("")),
  pagina_web: z.string().url("URL inválida").optional().or(z.literal("")),
  direccion: z.string().optional(),
})

interface FormularioCorresponsalProps {
  corresponsal?: Corresponsal
  onSuccess?: (corresponsal: Corresponsal) => void
  onCancel?: () => void
}

export function FormularioCorresponsal({ 
  corresponsal, 
  onSuccess, 
  onCancel 
}: FormularioCorresponsalProps) {
  const { createCorresponsal, updateCorresponsal, loading } = useAppStore()
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCorresponsalForm>({
    resolver: zodResolver(corresponsalSchema),
    defaultValues: {
      nombre_corresponsalia: corresponsal?.nombre_corresponsalia || '',
      nombre_contacto: corresponsal?.nombre_contacto || '',
      telefono: corresponsal?.telefono || '',
      correo: corresponsal?.correo || '',
      pagina_web: corresponsal?.pagina_web || '',
      direccion: corresponsal?.direccion || '',
    },
  })

  const onSubmit = async (data: CreateCorresponsalForm) => {
    try {
      if (corresponsal) {
        await updateCorresponsal(corresponsal.id_corresponsal, data)
        toast({
          title: 'Corresponsal actualizado',
          description: 'El corresponsal ha sido actualizado exitosamente.',
        })
      } else {
        await createCorresponsal(data)
        toast({
          title: 'Corresponsal creado',
          description: 'El corresponsal ha sido creado exitosamente.',
        })
      }
      
      // If this is for creation and we have onSuccess callback
      if (!corresponsal && onSuccess) {
        // Simulate the created corresponsal (in real app, you'd get this from the API response)
        const newCorresponsal: Corresponsal = {
          id_corresponsal: Date.now(), // Temporary ID
          ...data,
        }
        onSuccess(newCorresponsal)
      } else {
        onSuccess?.(corresponsal!)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el corresponsal.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre_corresponsalia">Nombre Corresponsalía *</Label>
          <Input
            id="nombre_corresponsalia"
            {...register('nombre_corresponsalia')}
          />
          {errors.nombre_corresponsalia && (
            <p className="text-sm text-red-500">{errors.nombre_corresponsalia.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nombre_contacto">Nombre de Contacto</Label>
          <Input
            id="nombre_contacto"
            {...register('nombre_contacto')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            {...register('telefono')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="correo">Correo Electrónico</Label>
          <Input
            id="correo"
            type="email"
            {...register('correo')}
          />
          {errors.correo && (
            <p className="text-sm text-red-500">{errors.correo.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pagina_web">Página Web</Label>
        <Input
          id="pagina_web"
          type="url"
          placeholder="https://ejemplo.com"
          {...register('pagina_web')}
        />
        {errors.pagina_web && (
          <p className="text-sm text-red-500">{errors.pagina_web.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          {...register('direccion')}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting ? 'Guardando...' : corresponsal ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}