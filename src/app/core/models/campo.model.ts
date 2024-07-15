export enum CONGREGACION_CAMPO {
  SIN_CAMPO = '1',
}

export class CampoModel {
  constructor(
    public id: number,
    public campo: string,
    public estado: boolean,
    public congregacion_id: number,
    public idObreroEncargado: number,
    public idObreroEncargadoDos?: number
  ) {}
}
