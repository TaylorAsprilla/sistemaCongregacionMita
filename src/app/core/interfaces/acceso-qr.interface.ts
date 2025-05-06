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

export interface AccesosQrResponseInterface {
  ok: boolean;
  msg: string;
  data: AccesoQrInterface[];
}
