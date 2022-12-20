export class AccesoMultimediaModel {
  constructor(
    public id: number,
    public login: string,
    public password: string,
    public solicitud_id: number,
    public tiempoAprobacion: string,
    public estado: boolean
  ) {}
}

export interface LoginUsuarioCmarLiveInterface {
  login: string;
  password: string;
  solicitud_id: number;
  tiempoAprobacion: Date;
  estado: boolean;
}

export class MultimediaCmarLiveModel {
  constructor(
    public id: number,
    public nombre: string,
    public celular: string,
    public email: string,
    public direccion: string,
    public ciudad: string,
    public departamento: string,
    public solicitud_id: number,
    public tiempoAprobacion: Date
  ) {}
}
