import { FamiliarInteface } from '../interfaces/familiar.interface';

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
    public familiaEnPR: boolean,
    public estado: boolean,
    public status: boolean,
    public razonSolicitud_id: number,
    public nacionalidad_id: number,
    public distancia: string,
    public departamento: string,
    public codigoPostal: string,
    public telefono: string,
    public familiares: FamiliarInteface
  ) {}
}
