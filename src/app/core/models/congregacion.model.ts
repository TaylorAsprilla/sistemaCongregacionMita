export enum CONGREGACION {
  SIN_CONGREGACION = '1',
}

export class CongregacionModel {
  constructor(
    public readonly id: number,
    public congregacion: string,
    public estado: boolean,
    public pais_id: number,
    public idObreroEncargado?: number,
    public idObreroEncargadoDos?: number,
    public email?: string,
    public password?: string
  ) {}
}
