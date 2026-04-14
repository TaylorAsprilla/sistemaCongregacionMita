/**
 * Interfaz para la respuesta de sesiones activas
 */
export interface ActiveSessionsResponse {
  ok: boolean;
  totalActiveSessions: number;
  sessions: ActiveSession[];
}

/**
 * Interfaz para una sesión activa individual
 */
export interface ActiveSession {
  sessionId: string;
  entidad: ActiveSessionEntidad;
  sessionLocation: ActiveSessionLocation;
  device: ActiveSessionDevice;
  network: ActiveSessionNetwork;
  timestamps: ActiveSessionTimestamps;
}

/**
 * Tipo de entidad que puede iniciar sesión (Usuario o Congregación)
 */
export type ActiveSessionEntidad = ActiveSessionUsuario | ActiveSessionCongregacion;

/**
 * Información del usuario en la sesión activa
 */
export interface ActiveSessionUsuario {
  tipo: 'usuario';
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  login: string;
  email: string;
  congregacion: {
    pais: string;
    nombre: string;
    campo: string;
  };
}

/**
 * Información de congregación como entidad de sesión
 */
export interface ActiveSessionCongregacion {
  tipo: 'congregacion';
  id: number;
  nombre: string;
  login: string;
  email: string;
  pais: string;
}

/**
 * Ubicación geográfica de la sesión
 */
export interface ActiveSessionLocation {
  pais: string;
  ciudad: string;
  region: string;
}

/**
 * Información del dispositivo
 */
export interface ActiveSessionDevice {
  navegador: string;
  so: string;
  dispositivo: string;
  tipoDispositivo: 'desktop' | 'mobile' | 'tablet';
}

/**
 * Información de red
 */
export interface ActiveSessionNetwork {
  ip: string;
  isp: string;
}

/**
 * Marcas de tiempo de la sesión
 */
export interface ActiveSessionTimestamps {
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
}
