import { environment } from 'environment';
import { DosisModel } from './dosis.model';
import { EstadoCivilModel } from './estado-civil.model';
import { FuenteIngresoModel } from './fuente-ingreso.model';
import { GeneroModel } from './genero.model';
import { GradoAcademicoModel } from './grado-academico.model';
import { MinisterioModel } from './ministerio.model';
import { NacionalidadModel } from './nacionalidad.model';
import { PermisoModel } from './permisos.model';
import { RolCasaModel } from './rol-casa.model';
import { TipoEmpleoModel } from './tipo-empleo.model';
import { TipoMiembroModel } from './tipo.miembro.model';
import { CongregacionInterface } from './usuarioCongregacion.model';
import { VacunaModel } from './vacuna.model';
import { VoluntariadoModel } from './voluntariado.model';

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
    public email: string,
    public numeroCelular: string,
    public fechaNacimiento: Date,
    public esJoven: boolean,
    public estado: boolean,
    public direccion: string,
    public ciudadDireccion: string,
    public paisDireccion: string,
    public genero_id: number,
    public estadoCivil_id: number,
    public vacuna_id: number,
    public dosis_id: number,
    public tipoMiembro_id: number,
    public segundoNombre?: string,
    public segundoApellido?: string,
    public apodo?: string,
    public ingresoMensual?: string,
    public especializacionEmpleo?: string,
    public telefonoCasa?: string,
    public login?: string,
    public password?: string,
    public foto?: string,
    public rolCasa_id?: number,
    public nacionalidad_id?: number,
    public gradoAcademico_id?: number,
    public tipoEmpleo_id?: number,
    public genero?: GeneroModel,
    public estadoCivil?: EstadoCivilModel,
    public rolCasa?: RolCasaModel,
    public vacuna?: VacunaModel,
    public dosis?: DosisModel,
    public nacionalidad?: NacionalidadModel,
    public gradoAcademico?: GradoAcademicoModel,
    public tipoEmpleo?: TipoEmpleoModel,
    public tipoMiembro?: TipoMiembroModel,
    public departamentoDireccion?: string,
    public codigoPostalDireccion?: string,
    public direccionPostal?: string,
    public ciudadPostal?: string,
    public departamentoPostal?: string,
    public codigoPostal?: string,
    public paisPostal?: string,
    public usuarioCongregacion?: CongregacionInterface,
    public usuarioMinisterio?: MinisterioModel[],
    public usuarioVoluntariado?: VoluntariadoModel[],
    public usuarioPermiso?: PermisoModel[],
    public usuarioFuenteIngreso?: FuenteIngresoModel[]
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

  get paisId() {
    return this.usuarioCongregacion[0]?.UsuarioCongregacion?.pais_id;
  }

  get congregacion() {
    return this.usuarioCongregacion[0]?.congregacion;
  }

  get congregacionId() {
    return this.usuarioCongregacion[0]?.id;
  }

  get campoId() {
    return this.usuarioCongregacion[0]?.UsuarioCongregacion?.campo_id;
  }

  get ministerios() {
    return this.usuarioMinisterio?.map((ministerio: MinisterioModel) => {
      return ministerio.id;
    });
  }

  get voluntariados() {
    return this.usuarioVoluntariado?.map((voluntariado: VoluntariadoModel) => {
      return voluntariado.id;
    });
  }

  get fuenteDeIngresos() {
    return this.usuarioFuenteIngreso?.map((fuenteDeIngreso: FuenteIngresoModel) => {
      return fuenteDeIngreso?.id;
    });
  }
}
