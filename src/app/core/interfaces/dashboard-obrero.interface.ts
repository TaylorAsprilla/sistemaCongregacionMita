/**
 * Interfaces para el Dashboard de Obrero
 * Response del endpoint: GET /api/usuarios/completo?obreroId=:id
 */

export interface DashboardObreroResponse {
  ok: boolean;
  data: UsuarioCompleto[];
  estadisticas?: EstadisticasAgregadas;
}

export interface UsuarioCompleto {
  id: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  apodo?: string;
  email: string;
  login?: string;
  numeroCelular?: string;
  telefonoCasa?: string;
  fechaNacimiento?: string;
  esJoven: boolean;
  estado: boolean;
  direccion?: string;
  ciudadDireccion?: string;
  paisDireccion?: string;
  departamentoDireccion?: string;
  codigoPostalDireccion?: string;
  direccionPostal?: string;
  ciudadPostal?: string;
  departamentoPostal?: string;
  codigoPostal?: string;
  paisPostal?: string;
  especializacionEmpleo?: string;
  foto?: string;
  numeroDocumento?: string;
  anoConocimiento?: string;
  createdAt?: string;
  updatedAt?: string;

  // Foreign Keys
  genero_id?: number;
  estadoCivil_id?: number;
  tipoMiembro_id?: number;
  rolCasa_id?: number;
  nacionalidad_id?: number;
  gradoAcademico_id?: number;
  tipoEmpleo_id?: number;
  tipoDocumento_id?: number;

  // Relaciones
  genero?: Genero;
  estadoCivil?: EstadoCivil;
  tipoMiembro?: TipoMiembro;
  rolCasa?: RolCasa;
  nacionalidad?: Nacionalidad;
  gradoAcademico?: GradoAcademico;
  usuarioCongregacion?: UsuarioCongregacion;
  usuarioCongregacionCongregacion?: Congregacion[];
  usuarioCongregacionCampo?: Campo[];
  usuarioCongregacionPais?: Pais[];
  usuarioMinisterio?: Ministerio[];
  usuarioVoluntariado?: Voluntariado[];
  usuarioPermiso?: Permiso[];
}

export interface Genero {
  id: number;
  genero: string;
  estado: boolean;
}

export interface EstadoCivil {
  id: number;
  estadoCivil: string;
  estado: boolean;
}

export interface TipoMiembro {
  id: number;
  tipo: string;
  estado: boolean;
}

export interface RolCasa {
  id: number;
  rol: string;
  estado: boolean;
}

export interface Nacionalidad {
  id: number;
  nacionalidad: string;
  estado: boolean;
}

export interface GradoAcademico {
  id: number;
  grado: string;
  estado: boolean;
}

export interface UsuarioCongregacion {
  usuario_id: number;
  pais_id: number;
  congregacion_id: number;
  campo_id: number;
}

export interface Congregacion {
  id: number;
  congregacion: string;
  estado: boolean;
  pais_id: number;
  idObreroEncargado?: number;
}

export interface Campo {
  id: number;
  campo: string;
  estado: boolean;
  congregacion_id: number;
  idObreroEncargado?: number;
}

export interface Pais {
  id: number;
  pais: string;
  estado: boolean;
  idDivisa?: number;
  idObreroEncargado?: number;
}

export interface Ministerio {
  id: number;
  ministerio: string;
  estado: boolean;
  ejerceMinisterio?: boolean;
}

export interface Voluntariado {
  id: number;
  nombreVoluntariado: string;
  estado: boolean;
}

export interface Permiso {
  id: number;
  permiso: string;
  estado: boolean;
}

/**
 * Estadísticas agregadas (si el backend las envía)
 */
export interface EstadisticasAgregadas {
  totalUsuarios?: number;
  nuevosUltimos7Dias?: number;
  nuevosUltimos30Dias?: number;
  activos?: number;
  inactivos?: number;
  porGenero?: { [key: string]: number };
  porEstadoCivil?: { [key: string]: number };
  porNacionalidad?: { [key: string]: number };
}

/**
 * Estadísticas calculadas en el front
 */
export interface EstadisticasDashboard {
  totalUsuarios: number;
  nuevosUltimos7Dias: number;
  nuevosUltimos30Dias: number;
  activos: number;
  inactivos: number;
  promedioEdad: number;
  totalJovenes: number;
  porcentajeJovenes: number;
  usuariosConVoluntariado: number;
  porcentajeVoluntariado: number;
  usuariosConMinisterio: number;
  porcentajeMinisterio: number;
  distribucionGenero: DistribucionItem[];
  distribucionEstadoCivil: DistribucionItem[];
  distribucionNacionalidad: DistribucionItem[];
  distribucionTipoMiembro: DistribucionItem[];
  distribucionMinisterio: DistribucionItem[];
  serieTemporal: SerieTemporal[];
}

export interface DistribucionItem {
  nombre: string;
  cantidad: number;
  porcentaje: number;
}

export interface SerieTemporal {
  fecha: string;
  cantidad: number;
}

/**
 * Filtros para la tabla de usuarios
 */
export interface FiltrosUsuarios {
  textoBusqueda?: string;
  genero_id?: number | null;
  estadoCivil_id?: number | null;
  nacionalidad_id?: number | null;
  esJoven?: boolean | null;
  voluntariado?: boolean | null;
  voluntariado_id?: number | null;
  ministerio?: boolean | null;
  ministerio_id?: number | null;
  congregacion_id?: number | null;
  ciudad?: string;
  estado?: boolean | null;
  edadMin?: number | null;
  edadMax?: number | null;
}

/**
 * Configuración de ordenamiento
 */
export interface ConfiguracionOrdenamiento {
  campo: 'nombre' | 'email' | 'fechaNacimiento' | 'createdAt';
  direccion: 'asc' | 'desc';
}
