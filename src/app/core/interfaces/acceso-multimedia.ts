export interface LoginUsuarioCmarLiveInterface {
  login: string;
  password: string;
  solicitud_id: number;
  tiempoAprobacion: Date | null;
  estado: boolean;
  usuarioQueAprobo_id: number | null;
}

export interface AccesoCongregacionMultimedia {
  email: string;
  password: string;
  idCongregacion: number;
}
