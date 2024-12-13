import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from '../enums/solicitudMultimendia.enum';

export interface LoginUsuarioCmarLiveInterface {
  login: string;
  password: string;
  solicitud_id: number;
  tiempoAprobacion: Date | null;
  estado: ESTADO_SOLICITUD_MULTIMEDIA_ENUM;
  usuarioQueAprobo_id: number | null;
}

export interface AccesoCongregacionMultimedia {
  email: string;
  password: string;
  idCongregacion: number;
}
