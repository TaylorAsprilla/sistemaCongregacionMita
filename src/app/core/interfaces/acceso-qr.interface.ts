export interface AccesoQrInterface {
  id: number;
  idQrCode: number | null;
  idUsuario: number | null;
  nombre: string | null;
  ip: string;
  dispositivo: string;
  ubicacion?: {
    ciudad: string | null;
    pais: string | null;
  } | null;
  createdAt: string;
  tipoPuesto: string | null;
  esGuarda: boolean | null;
  esCuidadora: boolean | null;
  enTurnoGuarda: boolean | null;
  puesto: string | null;
  resultado: string | null;
  resultadoIdentidad: string | null;
  motivoRechazo: string | null;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AccesosQrResponseInterface {
  ok: boolean;
  msg: string;
  data: AccesoQrInterface[];
  pagination?: PaginationMetadata;
}

export interface FiltrosAccesosQr {
  usuario?: string;
  dispositivo?: string;
  ubicacion?: string;
  accesoDe?: string;
  resultado?: string;
  identidad?: string;
  motivoRechazo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}
