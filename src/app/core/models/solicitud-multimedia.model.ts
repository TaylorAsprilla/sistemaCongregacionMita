import { UsuarioQueRegistraInterface } from '../interfaces/solicitud-multimedia';
import { AccesoMultimediaModel } from './acceso-multimedia.model';
import { NacionalidadModel } from './nacionalidad.model';
import { OpcionTransporteModel } from './opcion-transporte.model';
import { ParentescoModel } from './parentesco.model';
import { RazonSolicitudModel } from './razon-solicitud.model';
import { TipoAprobacionModel } from './tiempo-aprobacion.model';
import { TipoEstudioModel } from './tipo-estudio.model';
import { TipoMiembroModel } from './tipo.miembro.model';
import { UsuarioModel } from './usuario.model';

export enum RAZON_SOLICITUD_TEXTO {
  DISTANCIA_AL_TEMPLO_MAS_CERCANO = 'Distancia al templo más cercano',
  ESTUDIANTE = 'Estudiante',
  FUERZAS_ARMADAS = 'Fuerzas Armadas',
  ENFERMEDAD = 'Enfermedad',
  OTRA = 'Otra',
}

export enum RAZON_SOLICITUD_ID {
  DISTANCIA_AL_TEMPLO_MAS_CERCANO = '1',
  ESTUDIANTE = '2',
  FUERZAS_ARMADAS = '3',
  ENFERMEDAD = '4',
  OTRA = '5',
}

export enum TIEMPO_SUGERIDO_TEXT {
  QUINCE_DIAS = '15 Días',
  UN_MES = '1 Mes',
  SEIS_MESES = '6 Meses',
  UN_ANO = '1 Año',
  DOS_ANOS = '2 Años',
}

export enum TIEMPO_SUGERIDO_DIAS {
  QUINCE_DIAS = '15',
  UN_MES = '30',
  SEIS_MESES = '180',
  UN_ANO = '365',
  DOS_ANOS = '730',
}

export class SolicitudMultimediaModel {
  constructor(
    public id: number,
    public otraRazon: string | null,
    public tiempoDistancia: string | null,
    public horaTemploMasCercano: string | null,
    public personaEncamada: boolean | null,
    public personaEncargada: string | null,
    public celularPersonaEncargada: string | null,
    public enfermedadCronica: boolean | null,
    public enfermedadQuePadece: string | null,
    public paisDondeEstudia: string | null,
    public ciudadDondeEstudia: string | null,
    public duracionDelPeriodoDeEstudio: string | null,
    public baseMilitar: string | null,
    public observaciones: string,
    public motivoDeNegacion: string | null,
    public estado: boolean,
    public emailVerificado: boolean,
    public razonSolicitud_id: number,
    public usuarioQueRegistra_id: number,
    public opcionTransporte_id: number | null,
    public tipoDeEstudio_id: number | null,
    public parentesco_id: number | null,
    public usuario_id: number,
    public terminos: boolean,
    public tiempoAprobacion: string | null,
    public tiempoSugerido: string | null,
    public congregacionCercana: string | null,
    public createdAt: string,
    public updatedAt: string,
    public usuarioQueRegistra: UsuarioModel,
    public usuario: UsuarioModel,
    public razonSolicitud: RazonSolicitudModel,
    public tipoEstudio: TipoEstudioModel,
    public parentesco: ParentescoModel,
    public opcionTransporte: OpcionTransporteModel
  ) {}
}

export interface SolicitudMultimediaInterface {
  id: number;
  estado: boolean;
  razonSolicitud_id: number;
  usuarioQueRegistra_id: number;
  tiempoDistancia: string;
  horaTemploMasCercano: string;
  personaEncamada: boolean;
  personaEncargada: string;
  enfermedadCronica: boolean;
  enfermedadQuePadece: string;
  paisDondeEstudia: string;
  ciudadDondeEstudia: string;
  duracionDelPeriodoDeEstudio: Date;
  baseMilitar: string;
  emailVerificado: boolean;
  observaciones: string;
  opcionTransporte_id: number;
  tipoDeEstudio_id: number;
  otraRazon?: string;
  razonSolicitud?: RazonSolicitudModel;
  parentesco_id: number;
  tiempoAprobacion: Date;
  tipoMiembro: TipoMiembroModel;
  usuario_id: number;
  usuario: UsuarioModel;
  usuarioQueRegistra: UsuarioModel;
  tiempoSugerido: string;
  congregacionCercana: string;
  terminos: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface crearSolicitudMultimediaInterface {
  estado: boolean;
  razonSolicitud_id: number;
  usuarioQueRegistra_id: number;
  tiempoDistancia: string;
  horaTemploMasCercano: string;
  personaEncamada: boolean;
  personaEncargada: string;
  celularPersonaEncargada: string;
  enfermedadCronica: boolean;
  enfermedadQuePadece: string;
  paisDondeEstudia: string;
  ciudadDondeEstudia: string;
  duracionDelPeriodoDeEstudio: Date;
  baseMilitar: string;
  emailVerificado: boolean;
  observaciones: string;
  opcionTransporte_id: number;
  tipoDeEstudio_id: number;
  otraRazon?: string;
  razonSolicitud?: RazonSolicitudModel;
  parentesco_id: number;
  tiempoAprobacion: Date;
  tipoMiembro: TipoMiembroModel;
  congregacionCercana: string;
  usuario_id: number;
  usuario: UsuarioModel;
  usuarioQueRegistra: UsuarioModel;
  tiempoSugerido: string;
  terminos: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface denegarSolicitudMultimediaInterface {
  solicitud_id: number;
  motivoDeNegacion: string;
}
