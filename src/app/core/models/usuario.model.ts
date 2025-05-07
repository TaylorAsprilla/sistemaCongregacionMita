import { environment } from 'src/environments/environment';
import { EstadoCivilModel } from './estado-civil.model';
import { GeneroModel } from './genero.model';
import { GradoAcademicoModel } from './grado-academico.model';
import { MinisterioModel } from './ministerio.model';
import { PermisoModel } from './permisos.model';
import { RolCasaModel } from './rol-casa.model';
import { UsuarioCongregacionModel } from './usuarioCongregacion.model';
import { VoluntariadoModel } from './voluntariado.model';
import {
  usuarioCongregacionCampoInterface,
  usuarioCongregacionCongregacionInterface,
  UsuarioCongregacionPaisInterface,
} from '../interfaces/usuario.interface';
import { TipoMiembroInterface } from '../interfaces/solicitud-multimedia.interface';
import { NacionalidadInterface } from '../interfaces/nacionalidad.interface';
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
    public estado: boolean,
    public tipoMiembro: TipoMiembroInterface,
    public nacionalidad: NacionalidadInterface,
    public rolCasa: RolCasaModel,
    public esJoven: boolean,
    public genero: GeneroModel,
    public password?: string,
    public numeroDocumento?: string,
    public segundoNombre?: string,
    public segundoApellido?: string,
    public apodo?: string,
    public email?: string,
    public login?: string,
    public foto?: string,
    public telefonoCasa?: string,
    public direccion?: string,
    public ciudadDireccion?: string,
    public departamentoDireccion?: string,
    public codigoPostalDireccion?: string,
    public paisDireccion?: string,
    public direccionPostal?: string,
    public ciudadPostal?: string,
    public departamentoPostal?: string,
    public codigoPostal?: string,
    public paisPostal?: string,
    public anoConocimiento?: string,
    public ocupacion?: string,
    public especializacionEmpleo?: string,
    public estadoCivil?: EstadoCivilModel,
    public gradoAcademico?: GradoAcademicoModel,
    public tipoDocumento?: TipoDocumentoModel,
    public usuarioCongregacion?: UsuarioCongregacionModel,
    public usuarioMinisterio?: MinisterioModel[],
    public usuarioVoluntariado?: VoluntariadoModel[],
    public usuarioPermiso?: PermisoModel[],
    public usuarioCongregacionPais?: UsuarioCongregacionPaisInterface,
    public usuarioCongregacionCongregacion?: usuarioCongregacionCongregacionInterface,
    public usuarioCongregacionCampo?: usuarioCongregacionCampoInterface
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
