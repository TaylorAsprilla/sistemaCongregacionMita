export class AccesoMultimediaModel {
  constructor(
    public id: number,
    public nombre: string,
    public celular: string,
    public email: string,
    public direccion: string,
    public ciudad: string,
    public departamento: string,
    public solicitud_id: string,
    public tiempoAprobacion_id: string,
    public estado?: boolean
  ) {}
}

export interface LoginUsuarioCmarLive {
  id: number;
  login: string;
  password: string;
  solicitud_id: number;
  tiempoAprobacion_id: number;
  estado: boolean;
}
