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
  user: ActiveSessionUser;
  congregacion: ActiveSessionCongregacion;
  sessionLocation: ActiveSessionLocation;
  device: ActiveSessionDevice;
  network: ActiveSessionNetwork;
  timestamps: ActiveSessionTimestamps;
}

/**
 * Información del usuario en la sesión activa
 */
export interface ActiveSessionUser {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  login: string;
  email: string;
}

/**
 * Información de congregación del usuario
 */
export interface ActiveSessionCongregacion {
  pais: string;
  ciudad: string;
  campo: string;
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
