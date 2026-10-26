import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM } from '../enums/solicitudMultimendia.enum';
export interface UsuarioSolicitudInterface {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  numeroCelular: string | null;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  ciudadDireccion: string;
  departamentoDireccion: string;
  paisDireccion: string;
  login: string;
  solicitudes: SolicitudInterface[];
  tipoMiembro: TipoMiembroInterface;
  usuarioCongregacion: UsuarioCongregacionInterface;
}

export interface SolicitudInterface {
  id: number;
  emailVerificado: boolean | null;
  otraRazon: string;
  tiempoDistancia: string;
  personaEncamada: boolean | null;
  personaEncargada: string;
  celularPersonaEncargada: string;
  enfermedadCronica: boolean | null;
  enfermedadQuePadece: string;
  paisDondeEstudia: string;
  ciudadDondeEstudia: string;
  duracionDelPeriodoDeEstudio: string | Date | null;
  baseMilitar: string;
  horaTemploMasCercano: string;
  tiempoSugerido: number;
  tiempoAprobacion: string | null;
  congregacionCercana: string;
  observaciones: string;
  motivoDeNegacion: string | null;
  razonSolicitud: RazonSolicitudInterface;
  parentesco: ParentescoInterface | null;
  tipoEstudio: TipoEstudioInterface | null;
  opcionTransporte: OpcionTransporteInterface | null;
  usuarioQueRegistra: UsuarioQueRegistraInterface;
  usuarioQueAprobo: UsuarioQueAproboInterface | null;
  estado: ESTADO_SOLICITUD_MULTIMEDIA_ENUM;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  terminos?: boolean | null;
}

export interface RazonSolicitudInterface {
  solicitud: string;
}

export interface ParentescoInterface {
  nombre: string;
}

export interface TipoEstudioInterface {
  estudio: string;
}

export interface UsuarioQueRegistraInterface {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
}

export interface UsuarioQueAproboInterface {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
}

export interface TipoMiembroInterface {
  id: number;
  miembro: string;
}

export interface UsuarioCongregacionInterface {
  id: number;
  pais: PaisInterface;
  congregacion: CongregacionInterface;
  campo: CampoInterface;
}
export interface PaisInterface {
  id: number;
  pais: string;
  obreroEncargado: ObreroEncargadoInterface;
}
export interface CongregacionInterface {
  id: number;
  congregacion: string;
  obreroEncargado: ObreroEncargadoInterface;
}

export interface CampoInterface {
  id: number;
  campo: string;
  obreroEncargado: ObreroEncargadoInterface;
}

export interface OpcionTransporteInterface {
  tipoTransporte: string;
}

export interface ObreroEncargadoInterface {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
}
