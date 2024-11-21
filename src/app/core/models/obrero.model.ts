import { MinisterioModel } from './ministerio.model';
import { UsuarioModel } from './usuario.model';

export class ObreroModel {
  constructor(public usuario: UsuarioModel, public usuarioMinisterio: MinisterioModel) {}
}

export interface UsuarioMinisterioInterface {
  id: number;
  ministerio: string;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ObreroInterface {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  apodo: string;
  fechaNacimiento: string;
  email: string;
  telefonoCasa: string | null;
  numeroCelular: string;
  esJoven: boolean;
  especializacionEmpleo: string | null;
  numeroDocumento: string;
  login: string | null;
  password: string | null;
  foto: string | null;
  estado: boolean;
  resetToken: string | null;
  genero_id: number;
  estadoCivil_id: number;
  rolCasa_id: number;
  nacionalidad_id: number;
  gradoAcademico_id: number;
  tipoMiembro_id: number;
  tipoDocumento_id: number;
  direccion: string;
  ciudadDireccion: string;
  departamentoDireccion: string | null;
  codigoPostalDireccion: string;
  paisDireccion: string;
  direccionPostal: string;
  ciudadPostal: string;
  departamentoPostal: string | null;
  codigoPostal: string;
  paisPostal: string;
  anoConocimiento: string;
  ocupacion: string;
  idUsuarioQueRegistra: string | null;
  createdAt: string;
  updatedAt: string;
  usuarioMinisterio: UsuarioMinisterioInterface[];
}
