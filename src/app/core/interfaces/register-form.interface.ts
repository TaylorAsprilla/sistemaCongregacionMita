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
  email: string;
  direccion: string;
  ciudadDireccion: string;
  departamentoDireccion: string;
  paisDireccion: string;
  codigoPostalDireccion: string;
  direccionPostal: string;
  ciudadPostal: string;
  departamentoPostal: string;
  codigoPostal: string;
  paisPostal: string;
  fuentesDeIngreso: number[];
  ingresoMensual: string;
  gradoAcademico_id: number;
  tipoEmpleo_id: number;
  especializacionEmpleo: string;
  tipoMiembro_id: number;
  esJoven: boolean;
  ministerios: number[];
  voluntariados: number[];
  congregacion: CongregacionInterfase;
  vacuna_id: number;
  dosis_id: number;
  numeroDocumento: string;
  terminos: boolean;
  tipoDocumento_id?: number;
}

export interface CongregacionInterfase {
  usuario_id?: number;
  pais_id: number;
  congregacion_id: number;
  campo_id?: number;
}
