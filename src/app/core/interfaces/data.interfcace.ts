import { CongregacionModel } from '../models/congregacion.model';
import { SeccionInformeModel } from '../models/seccion-informe.model';

export interface Data {
  seccionInforme: SeccionInformeModel[];
  congregacion: CongregacionModel[];
  obrero: any[];
}
