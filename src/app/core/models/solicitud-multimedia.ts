import { AccesoMultimediaModel } from './acceso-multimedia.model';
import { NacionalidadModel } from './nacionalidad.model';
import { RazonSolicitudModel } from './razon-solicitud.model';
import { TipoAprobacionModel } from './tiempo-aprobacion.model';
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
    public opcionTransporte_id?: number,
    public tipoDeEstudio_id?: number,
    public parentesco_id?: number
  ) {}
}

export interface SolicitudMultimediaInterface {
  nombre: string;
  fechaNacimiento: Date;
  direccion: string;
  ciudad: string;
  celular: string;
  pais: string;
  email: string;
  miembroCongregacion: boolean;
  congregacionCercana: string;
  estado: boolean;
  status: boolean;
  razonSolicitud_id: number;
  nacionalidad_id: number;
  departamento: string;
  codigoPostal: string;
  telefono: string;
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
  observaciones: string;
  opcionTransporte_id: number;
  tipoDeEstudio_id: number;
  parentesco_id: number;
  terminos: boolean;
}
