interface Congregacion {
  congregacion: string;
}

interface QrAcceso {
  nombre: string;
}

export interface AccesoQrInterface {
  ip: string;
  dispositivo: string;
  createdAt: string;
  isLoginCodeQr: boolean;
  idCongregacion: number;
  pais: string;
  ciudad: string;
  qrAcceso: QrAcceso;
  congregacion: Congregacion;
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
