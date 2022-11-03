import { MinisterioModel } from './ministerio.model';
import { UsuarioModel } from './usuario.model';

export class ObreroModel {
  constructor(public usuario: UsuarioModel, public ministerio: MinisterioModel) {}
}
