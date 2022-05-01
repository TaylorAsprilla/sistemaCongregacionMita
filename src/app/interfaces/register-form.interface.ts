export interface RegisterForm {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDocumento: string;
  nacionalidad: string;
  email: string;
  numeroCelular: string;
  fechaNacimiento: Date;
  foto: string;
  genero_id: number;
  tipoDocmento_id: number;
  pais_id: number;
  terminos: boolean;
}
