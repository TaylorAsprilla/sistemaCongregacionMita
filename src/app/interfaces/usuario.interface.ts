import { UsuarioModel } from '../models/usuario.model';

export interface ListarUsuario {
  totalUsuarios: number;
  usuarios: UsuarioModel[];
}

export interface UsuarioInterface {
  ok: boolean;
  usuarios: UsuarioModel[];
}
