/**
 * Interfaz para la sesión de usuario con información de ubicación y dispositivo.
 * Corresponde a la tabla `userSession` en la base de datos.
 */
export interface UserSessionInterface {
  id: number;
  token: string;
  usuario_id: number;
  ip: string;
  userAgent: string;
  dispositivo: string;
  pais: string | null;
  ciudad: string | null;
  region: string | null;
  codigoPostal: string | null;
  latitud: number | null;
  longitud: number | null;
  isp: string | null;
  activa: boolean;
  fechaInicio: Date | string;
  fechaUltimaActividad: Date | string;
  fechaCierre: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Interfaz para la respuesta del backend al listar sesiones
 */
export interface UserSessionsResponseInterface {
  ok: boolean;
  success?: boolean;
  msg?: string;
  message?: string;
  totalSesiones: number;
  sesiones: UserSessionInterface[];
}

/**
 * Interfaz simplificada para mostrar sesiones en UI
 */
export interface UserSessionDisplayInterface {
  id: number;
  dispositivo: string;
  ubicacion: string; // "Ciudad, Pais" o "Ubicación desconocida"
  ip: string;
  fechaInicio: Date | string;
  fechaUltimaActividad: Date | string;
  esActual: boolean;
  activa: boolean;
}

/**
 * Interfaz para información de ubicación al iniciar sesión
 */
export interface SessionLocationInfoInterface {
  dispositivo: string;
  navegador: string;
  sistemaOperativo: string;
  ciudad: string | null;
  pais: string | null;
  ip: string;
  isp: string | null;
}
