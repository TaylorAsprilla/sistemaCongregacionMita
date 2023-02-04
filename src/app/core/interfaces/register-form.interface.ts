import { FuenteIngresoModel } from '../models/fuente-ingreso.model';
import { MinisterioModel } from '../models/ministerio.model';
import { VoluntariadoModel } from '../models/voluntariado.model';

export enum TIPO_DIRECCION {
  DIRECCION_RESIDENCIAL = 1,
  DIRECCION_POSTAL = 2,
  DIRECCION_LABORAL = 3,
}

export interface RegisterFormInterface {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  apodo: string;
  fechaNacimiento: Date;
  genero_id: number;
  estadoCivil_id: number;
  nacionalidad_id: number;
  rolCasa_id: number;
  numeroCelular: string;
  telefonoCasa: string;
  direcciones: DireccionInterface[];
  email: string;
  fuentesDeIngreso: FuenteIngresoModel[];
  ingresoMensual: string;
  gradoAcademico_id: number;
  tipoEmpleo_id: number;
  especializacionEmpleo: string;
  tipoMiembro_id: number;
  esJoven: boolean;
  ministerios: number[];
  voluntariados: VoluntariadoModel[];
  congregacion: CongregacionInterfase;
  vacuna_id: number;
  dosis_id: number;
  numeroDocumento: string;
  terminos: boolean;
  tipoDocumento_id?: number;
}

export interface DireccionInterface {
  direccion: string;
  ciudad: string;
  departamento?: string;
  codigoPostal?: string;
  pais: string;
  tipoDireccion_id: number;
}

export interface CongregacionInterfase {
  usuario_id?: number;
  pais_id: number;
  congregacion_id: number;
  campo_id?: number;
}
