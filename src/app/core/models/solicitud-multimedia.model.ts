import { AccesoMultimediaModel } from './acceso-multimedia.model';
import { NacionalidadModel } from './nacionalidad.model';
import { RazonSolicitudModel } from './razon-solicitud.model';
import { TipoAprobacionModel } from './tiempo-aprobacion.model';
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
    public nombre: string,
    public fechaNacimiento: Date,
    public direccion: string,
    public ciudad: string,
    public celular: string,
    public pais: string,
    public email: string,
    public miembroCongregacion: boolean,
    public congregacionCercana: string,
    public estado: boolean,
    public emailVerificado: boolean,
    public razonSolicitud_id: number,
    public nacionalidad_id: number,
    public usuarioQueRegistra_id: number,
    public usuarioQueRegistra: UsuarioModel,
    public terminos: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public departamento?: string,
    public codigoPostal?: string,
    public telefono?: string,
    public nacionalidad?: NacionalidadModel,
    public accesoMultimedia?: AccesoMultimediaModel,
    public razonSolicitud?: RazonSolicitudModel,
    public tiempoAprobación?: TipoAprobacionModel,
    public otraRazon?: string,
    public tiempoDistancia?: string,
    public horaTemploMasCercano?: string,
    public personaEncamada?: boolean,
    public personaEncargada?: string,
    public enfermedadCronica?: boolean,
    public enfermedadQuePadece?: string,
    public paisDondeEstudia?: string,
    public ciudadDondeEstudia?: string,
    public duracionDelPeriodoDeEstudio?: Date,
    public baseMilitar?: string,
    public observaciones?: string,
    public tiempoAprobacion?: Date,
    public opcionTransporte_id?: number,
    public tipoDeEstudio_id?: number,
    public parentesco_id?: number,
    public tiempoSugerido?: string
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
  terminos: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
