export type TipoMensajeInformativo = 'info' | 'warning' | 'success' | 'danger';

export interface MensajeInformativo {
  id?: number;
  titulo: string;
  mensaje: string;
  tipo?: TipoMensajeInformativo;
  activo: boolean;
  publicar_desde: string | Date;
  publicar_hasta: string | Date;
  prioridad?: number;
  creado_por?: number | string;
  actualizado_por?: number | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface MensajeInformativoResponse {
  ok: boolean;
  mensajeInformativo: MensajeInformativo;
  msg?: string;
}

export interface MensajesInformativosResponse {
  ok: boolean;
  mensajesInformativos: MensajeInformativo[];
  msg?: string;
}

export interface MensajesActivosResponse {
  ok: boolean;
  mensajesActivos: MensajeInformativo[];
  msg?: string;
}
