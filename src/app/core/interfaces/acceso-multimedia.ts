export interface LoginUsuarioCmarLiveInterface {
  login: string;
  password: string;
  solicitud_id: number;
  tiempoAprobacion: Date;
  estado: boolean;
}

export interface AccesoCongregacionMultimedia {
  email: string;
  password: string;
  idCongregacion: number;
}
