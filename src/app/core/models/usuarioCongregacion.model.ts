export class UsuarioCongregacionModel {
  constructor(
    public id: number,
    public usuario_id: number,
    public pais_id: number,
    public congregacion_id: number,
    public campo_id: number
  ) {}
}

export interface CongregacionInterface {
  UsuarioCongregacion: UsuarioCongregacionModel;
  congregacion: string;
  idObreroEncargado: string;
  pais_id: number;
}
