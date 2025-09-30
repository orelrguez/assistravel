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
  // Initial state
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
        .insert(caso)
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
      const updatedCasos = currentCasos.map(c => 
        c.id_caso === id ? data : c
      )
      set({ casos: updatedCasos, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  deleteCaso: async (id) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('Caso')
        .delete()
        .eq('id_caso', id)
      
      if (error) throw error
      
      const currentCasos = get().casos
      const filteredCasos = currentCasos.filter(c => c.id_caso !== id)
      set({ casos: filteredCasos })
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  
  fetchCorresponsales: async () => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Corresponsal')
        .select('*')
        .order('nombre_corresponsalia')
      
      if (error) throw error
      set({ corresponsales: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  createCorresponsal: async (corresponsal) => {
    set({ loading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('Corresponsal')
        .insert(corresponsal)
        .select()
        .single()
      
      if (error) throw error
      
      const currentCorresponsales = get().corresponsales
      set({ 
        corresponsales: [...currentCorresponsales, data],
        loading: false 
      })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
  
  updateCorresponsal: async (id, corresponsal) => {
    set({ loading: true, error: null })
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
      set({ corresponsales: updatedCorresponsales, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
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
      
      // Get cases with simplified query to avoid type issues
      const { data: casosData, error: casosError } = await supabase
        .from('Caso')
        .select(`
          estado_caso_interno,
          estado_del_caso
        `)
      
      if (casosError) throw casosError
      
      // Get facturas separately 
      const { data: facturasData, error: facturasError } = await supabase
        .from('Factura')
        .select(`
          fee,
          tiene_factura,
          costo_usd,
          id_caso
        `)
      
      if (facturasError) throw facturasError
      
      // Get corresponsales metrics
      const { data: corresponsalesData, error: corresponsalesError } = await supabase
        .from('Corresponsal')
        .select(`
          id_corresponsal
        `)
      
      if (corresponsalesError) throw corresponsalesError
      
      // Get cases for corresponsales count
      const { data: casosActivosData, error: casosActivosError } = await supabase
        .from('Caso')
        .select(`
          id_corresponsal,
          estado_caso_interno
        `)
        .eq('estado_caso_interno', 'Activo')
      
      if (casosActivosError) throw casosActivosError
      
      // Calculate metrics safely
      const casos = casosData || []
      const facturas = facturasData || []
      const corresponsales = corresponsalesData || []
      const casosActivos = casosActivosData || []
      
      // Create a map of caso to factura
      const facturaMap = new Map()
      facturas.forEach(f => {
        facturaMap.set(f.id_caso, f)
      })
      
      const metrics: DashboardMetrics = {
        casosActivos: casos.filter(c => c.estado_caso_interno === 'Activo').length,
        casosPendientesFacturar: casos.filter(c => {
          // Simple logic without factura reference for now
          return c.estado_del_caso === 'Para Refacturar'
        }).length,
        feeTotalPendiente: facturas
          .filter(f => !f.tiene_factura)
          .reduce((sum, f) => sum + (f.fee || 0), 0),
        costoUsdTotalEstimado: facturas
          .reduce((sum, f) => sum + (f.costo_usd || 0), 0),
        totalCorresponsales: corresponsales.length,
        corresponsalesConCasosActivos: Array.from(new Set(casosActivos.map(c => c.id_corresponsal))).length
      }
      
      set({ metrics })
    } catch (error: any) {
      set({ error: error.message })
    }
  }
}))

export default useAppStore