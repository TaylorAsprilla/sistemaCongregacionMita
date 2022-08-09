import { environment } from 'environment';

const base_url = environment.base_url;

export class UsuarioModel {
  constructor(
    public id: number,
    public primerNombre: string,
    public primerApellido: string,
    public nacionalidad: string,
    public email: string,
    public numeroCelular: string,
    public fechaNacimiento: Date,
    public estado: boolean,
    public genero_id: number,
    public pais_id: number,
    public estadoCivil_id: number,
    public vacuna_id: number,
    public dosis_id: number,
    public segundoNombre?: string,
    public segundoApellido?: string,
    public numeroDocumento?: string,
    public telefonoCasa?: string,
    public direccion?: string,
    public zipCode?: string,
    public login?: string,
    public password?: string,
    public foto?: string,
    public tipoDocumento_id?: number,
    public rolCasa_id?: number
  ) {}

  get fotoUrl() {
    if (!this.foto) {
      return `${base_url}/uploads/usuarios/no-image.jpg`;
    } else if (this.foto) {
      return `${base_url}/uploads/usuarios/${this.foto}`;
    } else {
      return `${base_url}/uploads/usuarios/no-image.jpg`;
    }
  }
}
