// Types for the database schema
export interface Corresponsal {
  id_corresponsal: number;
  nombre_corresponsalia: string;
  nombre_contacto?: string;
  telefono?: string;
  correo?: string;
  pagina_web?: string;
  direccion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Caso {
  id_caso: number;
  id_corresponsal: number;
  nro_caso_assistravel: string;
  nro_caso_corresponsal?: string;
  fecha_inicio_caso: string;
  estado_caso_interno: 'Activo' | 'Cerrado' | 'Cancelado' | 'Pausado';
  estado_del_caso: 'On going' | 'No FEE' | 'Para Refacturar' | 'Refacturado';
  im_informe_medico: boolean;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  // Relationship
  corresponsal?: Corresponsal;
  factura?: Factura;
}

export interface Factura {
  id_factura: number;
  id_caso: number;
  fee?: number;
  costo_usd?: number;
  costo_moneda_local?: number;
  tiene_factura: boolean;
  fecha_emision?: string;
  fecha_vto?: string;
  fecha_pago?: string;
  nro_de_factura?: string;
  monto_agregado?: number;
  observaciones_factura?: string;
  created_at?: string;
  updated_at?: string;
  // Relationship
  caso?: Caso;
}

// Database tables
export type Tables = {
  Corresponsal: Corresponsal;
  Caso: Caso;
  Factura: Factura;
};

// Form types
export interface CreateCorresponsalForm {
  nombre_corresponsalia: string;
  nombre_contacto?: string;
  telefono?: string;
  correo?: string;
  pagina_web?: string;
  direccion?: string;
}

export interface CreateCasoForm {
  id_corresponsal: number;
  nro_caso_assistravel: string;
  nro_caso_corresponsal?: string;
  fecha_inicio_caso: string;
  estado_caso_interno: 'Activo' | 'Cerrado' | 'Cancelado' | 'Pausado';
  estado_del_caso: 'On going' | 'No FEE' | 'Para Refacturar' | 'Refacturado';
  im_informe_medico: boolean;
  observaciones?: string;
  // Factura fields (conditional)
  tiene_factura: boolean;
  fee?: number;
  costo_usd?: number;
  costo_moneda_local?: number;
  fecha_emision?: string;
  fecha_vto?: string;
  fecha_pago?: string;
  nro_de_factura?: string;
  monto_agregado?: number;
  observaciones_factura?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  casosActivos: number;
  casosPendientesFacturar: number;
  feeTotalPendiente: number;
  costoUsdTotalEstimado: number;
  totalCorresponsales: number;
  corresponsalesConCasosActivos: number;
}

// Filter types
export interface CasoFilters {
  estadoCasoInterno?: string;
  estadoDelCaso?: string;
  corresponsal?: string;
  fechaInicio?: {
    from?: string;
    to?: string;
  };
  search?: string;
}

export interface CorresponsalFilters {
  search?: string;
}