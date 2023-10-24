import { UsuarioModel } from '../models/usuario.model';
import { UsuarioCongregacionModel } from '../models/usuarioCongregacion.model';

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
