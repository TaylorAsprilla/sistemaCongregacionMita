/**
 * Interface para Eventos en Vivo (Sistema Nuevo)
 * Endpoints: /api/evento-en-vivo
 */

export interface EventoEnVivo {
  id?: number;
  titulo: string;
  descripcion: string;
  linkTransmision: string;
  plataforma: 'youtube' | 'vimeo' | 'antmedia';
  tipoEvento_id: number;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  usuario?: {
    uid: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
}

export interface EventoEnVivoResponse {
  ok: boolean;
  eventoEnVivo: EventoEnVivo;
  msg?: string;
}

export interface EventosEnVivoResponse {
  ok: boolean;
  eventosEnVivo: EventoEnVivo[];
  total?: number;
}

export interface UltimoEventoResponse {
  ok: boolean;
  ultimoEvento?: EventoEnVivo;
  msg?: string;
}
