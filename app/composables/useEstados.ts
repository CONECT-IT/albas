import type { 
  EstadoVendedor, 
  EstadoComprador, 
  EstadoVisitaGuiada,
  TipoPersona 
} from '~~/shared/types'

// Opciones de estados para vendedores
export const ESTADOS_VENDEDOR: EstadoVendedor[] = [
  'Seguimiento',
  'Cierre',
  'No responde'
]

// Opciones de estados para compradores
export const ESTADOS_COMPRADOR: EstadoComprador[] = [
  'Aún no se ha contactado',
  'Esperando respuesta',
  'Agendó visita guiada',
  'Venta concretada',
  'No está interesado'
]

// Opciones de estados para visitas/citas
export const ESTADOS_VISITA: EstadoVisitaGuiada[] = [
  'Realizó visita',
  'Reprogramó',
  'Canceló',
  'No realizó visita'
]

// Tipos de persona
export const TIPOS_PERSONA: TipoPersona[] = [
  'Lead Alvas',
  'Lead Propio',
  'Referido',
  'Cliente'
]

// Helper para crear opciones de select
export const toSelectOptions = <T extends string>(arr: T[]) => 
  arr.map(value => ({ value, label: value }))
