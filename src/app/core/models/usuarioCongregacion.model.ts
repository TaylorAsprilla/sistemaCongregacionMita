import { CampoModel } from './campo.model';
import { CongregacionPaisModel } from './congregacion-pais.model';

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
  pais: CongregacionPaisModel;
  campo: CampoModel;
  idObreroEncargado: string;
  pais_id: number;
}
