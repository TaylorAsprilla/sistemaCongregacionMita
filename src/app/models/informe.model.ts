export enum EstadoInforme {
  DESHABILITADO = '0',
  EN_PROCESO = '1',
  TERMINADO = '2',
}

export class InformeModel {
  constructor(public id: number, public fecha: Date, public estado: number, public observaciones?: string) {}
}
