import {
  OpcionTransporteInterface,
  ParentescoInterface,
  RazonSolicitudInterface,
  TipoEstudioInterface,
  UsuarioQueRegistraInterface,
} from '../interfaces/solicitud-multimedia';
import { RazonSolicitudModel } from './razon-solicitud.model';
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

export class SolicitudModel {
  constructor(
    id: number,
    public emailVerificado: boolean,
    public otraRazon: string,
    public tiempoDistancia: string,
    public personaEncamada: boolean,
    public personaEncargada: string,
    public celularPersonaEncargada: string,
    public enfermedadCronica: boolean,
    public enfermedadQuePadece: string,
    public paisDondeEstudia: string,
    public ciudadDondeEstudia: string,
    public duracionDelPeriodoDeEstudio: string | null,
    public baseMilitar: string,
    public horaTemploMasCercano: string,
    public tiempoSugerido: string,
    public tiempoAprobacion: string | null,
    public estado: string,
    public congregacionCercana: string | null,
    public observaciones: string,
    public createdAt: Date,
    public razonSolicitud: RazonSolicitudInterface,
    public opcionTransporte: OpcionTransporteInterface | null,
    public usuarioQueRegistra: UsuarioQueRegistraInterface,
    public parentesco: ParentescoInterface | null,
    public tipoEstudio: TipoEstudioInterface | null
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
  usuarioQueAprobo_id: number | null;
}

export interface denegarSolicitudMultimediaInterface {
  solicitud_id: number;
  motivoDeNegacion: string;
}
