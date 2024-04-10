import { EstadoCivilModel } from '../models/estado-civil.model';
import { GeneroModel } from '../models/genero.model';
import { GradoAcademicoModel } from '../models/grado-academico.model';
import { MinisterioModel } from '../models/ministerio.model';
import { NacionalidadModel } from '../models/nacionalidad.model';
import { PermisoModel } from '../models/permisos.model';
import { RolCasaModel } from '../models/rol-casa.model';
import { TipoEmpleoModel } from '../models/tipo-empleo.model';
import { TipoMiembroModel } from '../models/tipo.miembro.model';
import { UsuarioModel } from '../models/usuario.model';
import { CongregacionInterface, UsuarioCongregacionModel } from '../models/usuarioCongregacion.model';
import { VoluntariadoModel } from '../models/voluntariado.model';

export interface ListarUsuario {
  totalUsuarios: number;
  usuarios: UsuarioModel[];
}

export interface UsuarioInterface {
  ok: boolean;
  usuario: UsuarioModel;
  usuarioCongregacion: UsuarioCongregacionModel;
}

export interface UsuarioCongregacionCiudadInterface {
  id: number;
  congregacion: string;
  estado: boolean;
  pais_id: number;
  idObreroEncargado: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioCongregacionCampoInterface {
  id: number;
  campo: string;
  estado: boolean;
  congregacion_id: number;
  idObreroEncargado: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioCongregacionPaisInterface {
  id: number;
  pais: string;
  estado: boolean;
  idDivisa: number;
  idObreroEncargado: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActualizarUsuarioInterface {
  primerNombre: string;
  primerApellido: string;
  email: string;
  numeroCelular: string;
  fechaNacimiento: Date;
  esJoven: boolean;
  estado: boolean;
  direccion: string;
  ciudadDireccion: string;
  paisDireccion: string;
  genero_id: number;
  estadoCivil_id: number;
  tipoMiembro_id: number;
  segundoNombre?: string;
  segundoApellido?: string;
  apodo?: string;
  especializacionEmpleo?: string;
  telefonoCasa?: string;
  login?: string;
  password?: string;
  foto?: string;
  rolCasa_id?: number;
  nacionalidad_id?: number;
  gradoAcademico_id?: number;
  tipoEmpleo_id?: number;
  genero?: GeneroModel;
  estadoCivil?: EstadoCivilModel;
  rolCasa?: RolCasaModel;
  nacionalidad?: NacionalidadModel;
  gradoAcademico?: GradoAcademicoModel;
  tipoEmpleo?: TipoEmpleoModel;
  tipoMiembro?: TipoMiembroModel;
  departamentoDireccion?: string;
  codigoPostalDireccion?: string;
  direccionPostal?: string;
  ciudadPostal?: string;
  departamentoPostal?: string;
  codigoPostal?: string;
  paisPostal?: string;
  usuarioCongregacion?: CongregacionInterface;
  usuarioMinisterio?: MinisterioModel[];
  usuarioVoluntariado?: VoluntariadoModel[];
  usuarioPermiso?: PermisoModel[];
  tipoDocumento_id?: number;
  numeroDocumento?: string;
  anoConocimiento?: string;
  usuarioCongregacionCongregacion?: UsuarioCongregacionCiudadInterface;
  usuarioCongregacionCampo?: UsuarioCongregacionCampoInterface;
  usuarioCongregacionPais?: UsuarioCongregacionPaisInterface;
}

export interface UsuariosPorCongregacionInterface {
  readonly id: number;
  primerNombre: string;
  primerApellido: string;
  segundoNombre?: string;
  segundoApellido?: string;
  apodo?: string;
  fechaNacimiento: Date;
  email: string;
  numeroCelular: string;
  pais: string;
  usuarioCongregacionPais?: usuarioCongregacionPaisInterface[];
  usuarioCongregacionCongregacion?: usuarioCongregacionCongregacionInterface[];
  usuarioCongregacionCampo?: usuarioCongregacionCampoInterface;
  campo: string;
  estado: boolean;
}

export interface usuarioCongregacionPaisInterface {
  pais: string;
  UsuarioCongregacion: {
    usuario_id: number;
    pais_id: number;
    congregacion_id: number;
    campo_id: number;
  };
}
export interface usuarioCongregacionCongregacionInterface {
  congregacion: string;
  UsuarioCongregacion: {
    usuario_id: number;
    pais_id: number;
    congregacion_id: number;
    campo_id: number;
  };
}
export interface usuarioCongregacionCampoInterface {
  campo: string;
  UsuarioCongregacion: {
    usuario_id: number;
    pais_id: number;
    congregacion_id: number;
    campo_id: number;
  };
}
export interface UsuariosPorCongregacionRespuesta {
  totalUsuarios: number;
  usuarios: UsuariosPorCongregacionInterface[];
}

export interface CambioPaginaEvent {
  valor: number;
  numeroPagina: number;
}
