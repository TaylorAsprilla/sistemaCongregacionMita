export enum ESTADO_INFORME_ENUM {
  ABIERTO = 'Abierto',
  CERRADO = 'Cerrado',
  EN_REVISION = 'EN_REVISION',
}

export class InformeModel {
  public periodo?: string;
  public tipo_congregacion?: 'PAIS' | 'CONGREGACION' | 'CAMPO';
  public congregacion_id?: number;

  constructor(
    public id?: number,
    public usuario_id?: number,
    public estado?: ESTADO_INFORME_ENUM,
  ) {}
}
