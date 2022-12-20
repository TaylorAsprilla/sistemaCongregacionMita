import { AccesoMultimediaModel, LoginUsuarioCmarLiveInterface } from './acceso-multimedia.model';
import { NacionalidadModel } from './nacionalidad.model';
import { RazonSolicitudModel } from './razon-solicitud.model';
import { TipoAprobacionModel } from './tiempo-aprobacion.model';
import { UsuarioModel } from './usuario.model';

export class SolicitudMultimediaModel {
  constructor(
    public id: number,
    public nombre: string,
    public direccion: string,
    public ciudad: string,
    public celular: string,
    public pais: string,
    public email: string,
    public miembroCongregacion: boolean,
    public congregacionCercana: string,
    public estado: boolean,
    public status: boolean,
    public razonSolicitud_id: number,
    public nacionalidad_id: number,
    public usuarioQueRegistra_id: number,
    public usuarioQueRegistra: UsuarioModel,
    public departamento?: string,
    public codigoPostal?: string,
    public telefono?: string,
    public nacionalidad?: NacionalidadModel,
    public accesoMultimedia?: AccesoMultimediaModel,
    public razonSolicitud?: RazonSolicitudModel,
    public tiempoAprobación?: TipoAprobacionModel,
    public otraRazon?: string
  ) {}
}

export interface SolicitudMultimediaInterface {
  nombre: string;
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
}
