export enum ESTADO_INFORME_ENUM {
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO',
  EN_REVISION = 'EN_REVISION',
}

export class InformeModel {
  constructor(
    public id?: number,
    public usuario_id?: number,
    public estado?: ESTADO_INFORME_ENUM,
  ) {}
}
