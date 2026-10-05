/**
 * Contratos del Dashboard Ejecutivo de Supervisión Congregacional.
 * Reflejan exactamente los DTO del backend (`src/types/dashboardSupervision.dto.ts`).
 */

export type ModoComparacion = 'TRIMESTRE_ANTERIOR' | 'MISMO_TRIMESTRE_ANIO_ANTERIOR';
export type TipoUnidad = 'PAIS' | 'CONGREGACION' | 'CAMPO';

export const ETIQUETAS_TIPO_UNIDAD: Record<TipoUnidad, string> = {
  PAIS: 'Congregación País',
  CONGREGACION: 'Congregación Ciudad',
  CAMPO: 'Congregación Campo',
};

/** Texto de ubicación de una congregación: la ciudad (si es campo) y el país (si no es la congregación país). */
export const ubicacionUnidad = (u: {
  tipo: TipoUnidad;
  pais: string | null;
  congregacion: string | null;
}): string =>
  [u.tipo === 'CAMPO' ? u.congregacion : null, u.tipo !== 'PAIS' ? u.pais : null]
    .filter(Boolean)
    .join(' · ');
export type EstadoEntrega = 'ENTREGADO' | 'EN_ELABORACION' | 'PENDIENTE' | 'SIN_OBRERO';
export type OrdenUnidades =
  | 'NOMBRE'
  | 'PAIS'
  | 'CONGREGACION'
  | 'MAYOR_INCREMENTO'
  | 'MAYOR_DISMINUCION'
  | 'MAS_ALERTAS';

export type EstadoVariacion =
  | 'VARIACION'
  | 'SIN_BASE_COMPARATIVA'
  | 'SIN_ACTIVIDAD'
  | 'SIN_INFORMACION_PREVIA'
  | 'INFORMACION_ACTUAL_INCOMPLETA'
  | 'SIN_INFORMACION';

export type TendenciaVariacion =
  | 'INCREMENTO_SIGNIFICATIVO'
  | 'INCREMENTO_MODERADO'
  | 'ESTABLE'
  | 'DISMINUCION_MODERADA'
  | 'DISMINUCION_SIGNIFICATIVA';

export type GrupoIndicador = 'ASISTENCIA' | 'VIDA_ESPIRITUAL' | 'TRABAJO_PASTORAL' | 'ADMINISTRACION';

export type TipoAlerta =
  | 'INFORME_PENDIENTE'
  | 'DISMINUCION'
  | 'INCREMENTO'
  | 'TENDENCIA_DISMINUCION'
  | 'TENDENCIA_CRECIMIENTO'
  | 'ASUNTO_RECURRENTE';

export type NivelAlerta = 'ATENCION' | 'INFORMATIVA';

export interface Variacion {
  anterior: number | null;
  actual: number | null;
  diferencia: number | null;
  porcentaje: number | null;
  estado: EstadoVariacion;
  tendencia: TendenciaVariacion | null;
  direccion: 'SUBE' | 'BAJA' | 'ESTABLE' | null;
  mensaje: string;
}

export interface FiltrosDashboard {
  anio: number;
  trimestre: number;
  pais_id: number | null;
  congregacion_id: number | null;
  campo_id: number | null;
  comparacion: ModoComparacion;
}

export interface PeriodoDashboard {
  anio: number;
  trimestre: number;
  etiqueta: string;
  nombre: string;
  fechaInicio: string;
}

export interface ContextoDashboard {
  filtros: FiltrosDashboard;
  periodo: PeriodoDashboard;
  periodoComparacion: PeriodoDashboard;
  descripcionComparacion: string;
  generadoEn: string;
}

export interface UnidadRef {
  tipo: TipoUnidad;
  id: number;
  nombre: string;
  pais_id: number | null;
  pais: string | null;
  congregacion_id: number | null;
  congregacion: string | null;
}

export interface Indicador {
  clave: string;
  etiqueta: string;
  grupo: GrupoIndicador;
  formato: 'ENTERO' | 'DECIMAL';
  valorPeriodo: number | null;
  variacion: Variacion;
}

export interface Cobertura {
  unidades: number;
  porTipo: Record<TipoUnidad, number>;
  conObrero: number;
  entregados: number;
  enElaboracion: number;
  pendientes: number;
  sinObrero: number;
  porcentajeConInforme: number | null;
  informesPeriodo: number;
  unidadesComparadas: number;
}

export interface AsistenciaServicio {
  categoria: string;
  etiqueta: string;
  cantidad: number | null;
  asistencia: number | null;
  promedio: number | null;
  variacionPromedio: Variacion;
}

export interface CategoriaEspiritual {
  id: number;
  nombre: string;
  valorPeriodo: number | null;
  variacion: Variacion;
}

export interface ResumenDashboard {
  contexto: ContextoDashboard;
  cobertura: Cobertura;
  indicadores: Indicador[];
  asistenciaPorServicio: AsistenciaServicio[];
  variacionPorServicio: VariacionServicio[];
  actividadesEspiritualesPorCategoria: CategoriaEspiritual[];
  actividadEconomica: { disponible: boolean; montoRecaudado: number | null; mensaje: string };
  alertas: { total: number; porTipo: Record<string, number> };
}

export interface PuntoSerie {
  periodo: string;
  valor: number | null;
}

export interface Serie {
  clave: string;
  etiqueta: string;
  formato: 'ENTERO' | 'DECIMAL';
  puntos: PuntoSerie[];
}

export interface TendenciasDashboard {
  contexto: ContextoDashboard;
  periodos: PeriodoDashboard[];
  informesPorPeriodo: PuntoSerie[];
  series: Serie[];
}

export interface AlertaDashboard {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  unidad: UnidadRef;
  indicador: string | null;
  etiquetaIndicador: string | null;
  mensaje: string;
  periodo: string;
  detalle: {
    anterior?: number | null;
    actual?: number | null;
    porcentaje?: number | null;
    variaciones?: number[];
    trimestres?: number;
    asunto?: string;
  };
}

export interface AlertasDashboard {
  contexto: ContextoDashboard;
  total: number;
  porTipo: Record<string, number>;
  alertas: AlertaDashboard[];
}

export interface UnidadFila {
  unidad: UnidadRef;
  obreros: string[];
  estadoEntrega: EstadoEntrega;
  informes: number;
  indicadores: Record<string, Variacion>;
  alertas: number;
}

export interface UnidadesDashboard {
  contexto: ContextoDashboard;
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
  unidades: UnidadFila[];
}

export interface DetalleUnidad {
  contexto: ContextoDashboard;
  unidad: UnidadRef;
  obreros: { id: number; nombre: string; email: string | null }[];
  estadoEntrega: EstadoEntrega;
  informes: { id: number; periodo: string; estado: string; obrero: string; creado: string | null }[];
  indicadores: Indicador[];
  asistenciaPorServicio: AsistenciaServicio[];
  historico: { periodos: PeriodoDashboard[]; series: Serie[] };
  logros: { logro: string; responsable: string | null; fecha: string | null }[];
  metas: { meta: string; accion: string | null; fecha: string | null; fechaCumplimiento: string | null }[];
  asuntosPendientes: { asunto: string; tipoAsunto: string | null; responsable: string | null; recurrente: boolean }[];
  alertas: AlertaDashboard[];
}

export interface OpcionFiltro {
  id: number;
  nombre: string;
  pais_id?: number | null;
  congregacion_id?: number | null;
}

export interface FiltrosDisponibles {
  periodoActivo: PeriodoDashboard;
  anios: number[];
  trimestres: { valor: number; etiqueta: string }[];
  comparaciones: { valor: ModoComparacion; etiqueta: string }[];
  paises: OpcionFiltro[];
  congregaciones: OpcionFiltro[];
  campos: OpcionFiltro[];
  umbrales: { significativo: number; moderado: number };
}

export interface ConsultaUnidades {
  busqueda?: string;
  tipo?: TipoUnidad | '';
  estado?: EstadoEntrega | '';
  orden?: OrdenUnidades;
  pagina?: number;
  porPagina?: number;
  servicio?: ClaveServicio | '';
  variacion?: FiltroVariacion | '';
}

export type ClaveServicio = 'general' | 'martes' | 'jueves' | 'domingo' | 'otros';
export type GrupoVariacion = TendenciaVariacion | 'SIN_COMPARACION';
export type FiltroVariacion = GrupoVariacion | 'DISMINUYO' | 'AUMENTO';

export interface VariacionServicio {
  clave: ClaveServicio;
  etiqueta: string;
  indicador: string;
  conteo: Record<GrupoVariacion, number>;
}

export const GRUPOS_VARIACION: { valor: GrupoVariacion; etiqueta: string; clase: string }[] = [
  { valor: 'DISMINUCION_SIGNIFICATIVA', etiqueta: 'Disminución significativa', clase: 'btn-danger' },
  { valor: 'DISMINUCION_MODERADA', etiqueta: 'Disminución moderada', clase: 'btn-warning' },
  { valor: 'ESTABLE', etiqueta: 'Sin variación significativa', clase: 'btn-secondary' },
  { valor: 'INCREMENTO_MODERADO', etiqueta: 'Incremento moderado', clase: 'btn-info' },
  { valor: 'INCREMENTO_SIGNIFICATIVO', etiqueta: 'Incremento significativo', clase: 'btn-success' },
  { valor: 'SIN_COMPARACION', etiqueta: 'Sin comparación', clase: 'btn-light border' },
];

export const FILTROS_VARIACION: { valor: FiltroVariacion; etiqueta: string }[] = [
  { valor: 'DISMINUYO', etiqueta: 'Disminuyó (cualquier nivel)' },
  { valor: 'AUMENTO', etiqueta: 'Aumentó (cualquier nivel)' },
  ...GRUPOS_VARIACION.map((g) => ({ valor: g.valor as FiltroVariacion, etiqueta: g.etiqueta })),
];

export const SERVICIOS_VARIACION: { valor: ClaveServicio; etiqueta: string; indicador: string }[] = [
  { valor: 'general', etiqueta: 'Todos los servicios', indicador: 'promedioAsistenciaServicio' },
  { valor: 'martes', etiqueta: 'Servicio martes', indicador: 'promedioServicioMartes' },
  { valor: 'jueves', etiqueta: 'Servicio jueves', indicador: 'promedioServicioJueves' },
  { valor: 'domingo', etiqueta: 'Servicio domingo', indicador: 'promedioServicioDomingo' },
  { valor: 'otros', etiqueta: 'Servicios otros días', indicador: 'promedioServicioOtrosDias' },
];

export const ETIQUETAS_ESTADO_ENTREGA: Record<EstadoEntrega, string> = {
  ENTREGADO: 'Entregado',
  EN_ELABORACION: 'En elaboración',
  PENDIENTE: 'Pendiente',
  SIN_OBRERO: 'Sin obrero asignado',
};

export const ETIQUETAS_TIPO_ALERTA: Record<TipoAlerta, string> = {
  INFORME_PENDIENTE: 'Informe pendiente',
  TENDENCIA_DISMINUCION: 'Tendencia de disminución',
  DISMINUCION: 'Disminución significativa',
  ASUNTO_RECURRENTE: 'Asunto recurrente',
  TENDENCIA_CRECIMIENTO: 'Tendencia de crecimiento',
  INCREMENTO: 'Incremento significativo',
};
