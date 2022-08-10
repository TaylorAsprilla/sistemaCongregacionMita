import { UsuarioModel } from '../models/usuario.model';
import { UsuarioCongregacionModel } from '../models/usuarioCongregacion.model';

export interface ListarUsuario {
  totalUsuarios: number;
  usuarios: UsuarioModel[];
  usuarioCongregacion: UsuarioCongregacionModel[];
}

export interface UsuarioInterface {
  ok: boolean;
  usuario: UsuarioModel;
  usuarioCongregacion: UsuarioCongregacionModel;
}
