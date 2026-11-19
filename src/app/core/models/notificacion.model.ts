export type CategoriaNotificacion = 'INFORMATIVA' | 'PENDIENTE' | 'ADMINISTRATIVA' | 'SOLICITUD';

export type EstadoFiltroNotificacion = 'todas' | 'no-leidas' | 'leidas';

export interface NotificacionModel {
  id: number;
  tipo: string;
  categoria: CategoriaNotificacion;
  titulo: string;
  mensaje: string;
  entidadTipo: string | null;
  entidadId: number | null;
  /** Ruta interna de la aplicación (`/sistema/...`). */
  urlDestino: string | null;
  leida: boolean;
  fechaLectura: string | null;
  fechaCreacion: string;
}

export interface FiltroNotificaciones {
  estado?: EstadoFiltroNotificacion;
  categoria?: CategoriaNotificacion | '';
  pagina?: number;
  porPagina?: number;
}

export interface ListaNotificaciones {
  ok: boolean;
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
  noLeidas: number;
  notificaciones: NotificacionModel[];
}

/** Presentación por categoría: etiqueta legible, icono Font Awesome y clase de color. */
export const CATEGORIAS_NOTIFICACION: Record<CategoriaNotificacion, { etiqueta: string; icono: string; clase: string }> = {
  INFORMATIVA: { etiqueta: 'Informativa', icono: 'fa-solid fa-circle-info', clase: 'cat-informativa' },
  PENDIENTE: { etiqueta: 'Pendiente', icono: 'fa-solid fa-clock', clase: 'cat-pendiente' },
  ADMINISTRATIVA: { etiqueta: 'Alerta administrativa', icono: 'fa-solid fa-chart-line', clase: 'cat-administrativa' },
  SOLICITUD: { etiqueta: 'Solicitud', icono: 'fa-solid fa-envelope-open-text', clase: 'cat-solicitud' },
};
