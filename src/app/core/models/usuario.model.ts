import { environment } from 'src/environments/environment';
import { EstadoCivilModel } from './estado-civil.model';
import { GeneroModel } from './genero.model';
import { GradoAcademicoModel } from './grado-academico.model';
import { MinisterioModel } from './ministerio.model';
import { NacionalidadModel } from './nacionalidad.model';
import { PermisoModel } from './permisos.model';
import { RolCasaModel } from './rol-casa.model';
import { TipoMiembroModel } from './tipo.miembro.model';
import { UsuarioCongregacionModel } from './usuarioCongregacion.model';
import { VoluntariadoModel } from './voluntariado.model';
import {
  UsuarioCongregacionCampoInterface,
  UsuarioCongregacionCiudadInterface,
  UsuarioCongregacionPaisInterface,
} from '../interfaces/usuario.interface';
import { TipoDocumentoModel } from './tipo-documento.model';

const base_url = environment.base_url;

export enum OPERACION {
  CREAR_USUARIO = 'Crear Usuario',
  ACTUALIZAR_USUARIO = 'Actualizar Usuario',
  ELIMINAR_USUARIO = 'Eliminar Usuario',
}

export class UsuarioModel {
  constructor(
    public id: number,
    public primerNombre: string,
    public primerApellido: string,
    public numeroCelular: string,
    public fechaNacimiento: Date,
    public esJoven: boolean,
    public estado: boolean,
    public direccion: string,
    public ciudadDireccion: string,
    public paisDireccion: string,
    public ocupacion: string,
    public genero_id: number,
    public estadoCivil_id: number,
    public tipoMiembro_id: number,
    public segundoNombre?: string,
    public segundoApellido?: string,
    public apodo?: string,
    public email?: string,
    public especializacionEmpleo?: string,
    public telefonoCasa?: string,
    public login?: string,
    public password?: string,
    public foto?: string,
    public rolCasa_id?: number,
    public nacionalidad_id?: number,
    public gradoAcademico_id?: number,
    public genero?: GeneroModel,
    public estadoCivil?: EstadoCivilModel,
    public rolCasa?: RolCasaModel,
    public nacionalidad?: NacionalidadModel,
    public gradoAcademico?: GradoAcademicoModel,
    public tipoMiembro?: TipoMiembroModel,
    public departamentoDireccion?: string,
    public codigoPostalDireccion?: string,
    public direccionPostal?: string,
    public ciudadPostal?: string,
    public departamentoPostal?: string,
    public codigoPostal?: string,
    public paisPostal?: string,
    public usuarioCongregacion?: UsuarioCongregacionModel,
    public usuarioMinisterio?: MinisterioModel[],
    public usuarioVoluntariado?: VoluntariadoModel[],
    public usuarioPermiso?: PermisoModel[],
    public tipoDocumento_id?: number,
    public tipoDocumento?: TipoDocumentoModel,
    public numeroDocumento?: string,
    public anoConocimiento?: string,
    public usuarioCongregacionCongregacion?: UsuarioCongregacionCiudadInterface[],
    public usuarioCongregacionCampo?: UsuarioCongregacionCampoInterface[],
    public usuarioCongregacionPais?: UsuarioCongregacionPaisInterface[],
    public idUsuarioQueRegistra?: number,
    public congregacion?: string
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

  get paisId(): number | undefined {
    return Array.isArray(this.usuarioCongregacion) && this.usuarioCongregacion.length > 0
      ? this.usuarioCongregacion[0]?.UsuarioCongregacion?.pais_id
      : undefined;
  }

  get congregacionId(): number | undefined {
    return Array.isArray(this.usuarioCongregacion) && this.usuarioCongregacion.length > 0
      ? this.usuarioCongregacion[0]?.id
      : undefined;
  }

  get campoId(): number | undefined {
    return Array.isArray(this.usuarioCongregacion) && this.usuarioCongregacion.length > 0
      ? this.usuarioCongregacion[0]?.UsuarioCongregacion?.campo_id
      : undefined;
  }

  get ministerios(): number[] | undefined {
    return this.usuarioMinisterio?.map((ministerio: MinisterioModel) => ministerio.id);
  }

  get voluntariados(): number[] | undefined {
    return this.usuarioVoluntariado?.map((voluntariado: VoluntariadoModel) => voluntariado.id);
  }
}
