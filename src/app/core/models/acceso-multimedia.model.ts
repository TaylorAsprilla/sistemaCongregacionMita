export class SolicitudMultimediaModel {
  constructor(
    public id: number,
    public nombre: string,
    public direccion: string,
    public ciudad: string,
    public email: string,
    public miembroCongregacion: boolean,
    public familiaEnPR: boolean,
    public estado: boolean,
    public pais_id: number,
    public razonSolicitud_id: number,
    public congregacion_id: number,
    public congregacionCercana_id: number,
    public nacionacilidad_id: number,
    public distancia?: string,
    public departamento?: string,
    public codigoPostal?: string,
    public telefono?: string,
    public celular?: string,
    public login?: string,
    public password?: string,
    public familia_id?: number,
    public aprobacion_id?: number
  ) {}
}
