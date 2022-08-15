import { UsuarioModel } from '../models/usuario.model';

export interface LoginForm {
  login: string;
  password: string;
  remember: boolean;
}

export interface Login {
  login: string;
  password: string;
  remember: boolean;
  usuario: UsuarioModel;
}
