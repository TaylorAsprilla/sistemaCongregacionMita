export interface RegisterForm {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDocumento: string;
  nacionalidad: string;
  email: string;
  numeroCelular: string;
  telefonoCasa: string;
  direccion: string;
  zipCode: string;
  fechaNacimiento: Date;
  foto: string;
  genero_id: number;
  tipoDocmento_id: number;
  pais_id: number;
  estadoCivil_id: number;
  vacuna_id: number;
  dosis_id: number;
  tipoDocumento_id?: number;
  rolCasa_id?: number;
  terminos: boolean;
}
