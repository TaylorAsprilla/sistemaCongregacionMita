export enum CONGREGACION_PAIS {
  SIN_CONGREGACION_PAIS = '42',
}

export class CongregacionPaisModel {
  constructor(
    public id: number,
    public pais: string,
    public estado: boolean,
    public idDivisa?: number,
    public idObreroEncargado?: number
  ) {}
}
