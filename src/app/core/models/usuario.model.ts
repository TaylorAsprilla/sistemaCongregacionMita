import { environment } from 'environment';
import { DireccionInterface } from '../interfaces/register-form.interface';
import { DosisModel } from './dosis.model';
import { EstadoCivilModel } from './estado-civil.model';
import { GeneroModel } from './genero.model';
import { GradoAcademicoModel } from './grado-academico.model';
import { MinisterioModel } from './ministerio.model';
import { NacionalidadModel } from './nacionalidad.model';
import { RolCasaModel } from './rol-casa.model';
import { TipoDocumentoModel } from './tipo-documento.model';
import { TipoEmpleoModel } from './tipo-empleo.model';
import { TipoMiembroModel } from './tipo.miembro.model';
import { CongregacionInterface, UsuarioCongregacionModel } from './usuarioCongregacion.model';
import { VacunaModel } from './vacuna.model';

const base_url = environment.base_url;

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
    public numeroDocumento?: string,
    public telefonoCasa?: string,
    public login?: string,
    public password?: string,
    public foto?: string,
    public tipoDocumento_id?: number,
    public rolCasa_id?: number,
    public nacionalidad_id?: number,
    public gradoAcademico_id?: number,
    public tipoEmpleo_id?: number,
    public tipoDocumento?: TipoDocumentoModel,
    public genero?: GeneroModel,
    public estadoCivil?: EstadoCivilModel,
    public rolCasa?: RolCasaModel,
    public vacuna?: VacunaModel,
    public dosis?: DosisModel,
    public nacionalidad?: NacionalidadModel,
    public gradoAcademico?: GradoAcademicoModel,
    public tipoEmpleo?: TipoEmpleoModel,
    public tipoMiembro?: TipoMiembroModel,
    public direcciones?: DireccionInterface[],
    public usuarioCongregacion?: CongregacionInterface,
    public usuarioMinisterio?: MinisterioModel
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

  get nombreCongregacion() {
    return this.usuarioCongregacion[0]?.congregacion;
  }

  get campoId() {
    return this.usuarioCongregacion[0]?.UsuarioCongregacion.campo_id;
  }

  get paisId() {
    return this.usuarioCongregacion[0]?.UsuarioCongregacion.pais_id;
  }
}
