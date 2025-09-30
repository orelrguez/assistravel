import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'
import type { Caso, Corresponsal, Factura, DashboardMetrics } from '@/types/database'

interface AppState {
  // Auth
  user: any | null
  setUser: (user: any | null) => void
  
  // Cases
  casos: Caso[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchCasos: () => Promise<void>
  createCaso: (caso: Partial<Caso>) => Promise<void>
  updateCaso: (id: number, caso: Partial<Caso>) => Promise<void>
  deleteCaso: (id: number) => Promise<void>
  
  // Corresponsales
  corresponsales: Corresponsal[]
  fetchCorresponsales: () => Promise<void>
  createCorresponsal: (corresponsal: Partial<Corresponsal>) => Promise<void>
  updateCorresponsal: (id: number, corresponsal: Partial<Corresponsal>) => Promise<void>
  deleteCorresponsal: (id: number) => Promise<void>
  
  // Dashboard
  metrics: DashboardMetrics | null
  fetchMetrics: () => Promise<void>
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),
  
  // Cases
  casos: [],
  loading: false,
  error: null,
  
  // Corresponsales
  corresponsales: [],
  
  // Dashboard
  metrics: null,
  
  // UI State
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Actions
  fetchCasos: async () => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Caso')
        .select(`
          *,
          corresponsal:Corresponsal(*),
          factura:Factura(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ casos: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  createCaso: async (caso) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Caso')
        .insert([caso])
        .select(`
          *,
          corresponsal:Corresponsal(*),
          factura:Factura(*)
        `)
        .single()
      
      if (error) throw error
      
      const currentCasos = get().casos
      set({ casos: [data, ...currentCasos], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  updateCaso: async (id, caso) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Caso')
        .update(caso)
        .eq('id_caso', id)
        .select(`
          *,
          corresponsal:Corresponsal(*),
          factura:Factura(*)
        `)
        .single()
      
      if (error) throw error
      
      const currentCasos = get().casos
      const updatedCasos = currentCasos.map(c => c.id_caso === id ? data : c)
      set({ casos: updatedCasos, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  deleteCaso: async (id) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('Caso')
        .delete()
        .eq('id_caso', id)
      
      if (error) throw error
      
      const currentCasos = get().casos
      const filteredCasos = currentCasos.filter(c => c.id_caso !== id)
      set({ casos: filteredCasos, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  fetchCorresponsales: async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Corresponsal')
        .select('*')
        .order('nombre_corresponsalia')
      
      if (error) throw error
      set({ corresponsales: data || [] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  createCorresponsal: async (corresponsal) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Corresponsal')
        .insert([corresponsal])
        .select()
        .single()
      
      if (error) throw error
      
      const currentCorresponsales = get().corresponsales
      set({ corresponsales: [...currentCorresponsales, data] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  updateCorresponsal: async (id, corresponsal) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Corresponsal')
        .update(corresponsal)
        .eq('id_corresponsal', id)
        .select()
        .single()
      
      if (error) throw error
      
      const currentCorresponsales = get().corresponsales
      const updatedCorresponsales = currentCorresponsales.map(c => 
        c.id_corresponsal === id ? data : c
      )
      set({ corresponsales: updatedCorresponsales })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  deleteCorresponsal: async (id) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('Corresponsal')
        .delete()
        .eq('id_corresponsal', id)
      
      if (error) throw error
      
      const currentCorresponsales = get().corresponsales
      const filteredCorresponsales = currentCorresponsales.filter(c => 
        c.id_corresponsal !== id
      )
      set({ corresponsales: filteredCorresponsales })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  fetchMetrics: async () => {
    try {
      const supabase = createClient()
      
      // Get cases metrics
      const { data: casos, error: casosError } = await supabase
        .from('Caso')
        .select(`
          estado_caso_interno,
          estado_del_caso,
          factura:Factura(fee, tiene_factura, costo_usd)
        `)
      
      if (casosError) throw casosError
      
      // Get corresponsales metrics
      const { data: corresponsales, error: corresponsalesError } = await supabase
        .from('Corresponsal')
        .select(`
          id_corresponsal,
          casos:Caso(estado_caso_interno)
        `)
      
      if (corresponsalesError) throw corresponsalesError
      
      // Calculate metrics - handle factura as array from Supabase join
      const casosActivos = casos?.filter(c => c.estado_caso_interno === 'Activo').length || 0
      const casosPendientesFacturar = casos?.filter(c => {
        const factura = Array.isArray(c.factura) ? c.factura[0] : c.factura
        return !factura?.tiene_factura || c.estado_del_caso === 'Para Refacturar'
      }).length || 0
      
      const feeTotalPendiente = casos
        ?.filter(c => {
          const factura = Array.isArray(c.factura) ? c.factura[0] : c.factura
          return !factura?.tiene_factura
        })
        .reduce((sum, c) => {
          const factura = Array.isArray(c.factura) ? c.factura[0] : c.factura
          return sum + (factura?.fee || 0)
        }, 0) || 0
      
      const costoUsdTotalEstimado = casos
        ?.filter(c => c.estado_caso_interno === 'Activo')
        .reduce((sum, c) => {
          const factura = Array.isArray(c.factura) ? c.factura[0] : c.factura
          return sum + (factura?.costo_usd || 0)
        }, 0) || 0
      
      const totalCorresponsales = corresponsales?.length || 0
      const corresponsalesConCasosActivos = corresponsales?.filter(c => 
        c.casos?.some((caso: any) => caso.estado_caso_interno === 'Activo')
      ).length || 0
      
      const metrics: DashboardMetrics = {
        casosActivos,
        casosPendientesFacturar,
        feeTotalPendiente,
        costoUsdTotalEstimado,
        totalCorresponsales,
        corresponsalesConCasosActivos
      }
      
      set({ metrics })
    } catch (error: any) {
      set({ error: error.message })
    }
  }
}))

export default useAppStore