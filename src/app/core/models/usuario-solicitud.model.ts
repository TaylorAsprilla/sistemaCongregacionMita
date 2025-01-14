import { SolicitudInterface, UsuarioCongregacionInterface } from '../interfaces/solicitud-multimedia.interface';
import { TipoMiembroModel } from './tipo.miembro.model';

export class UsuarioSolicitudMultimediaModel {
  constructor(
    public id: number,
    public primerNombre: string,
    public segundoNombre: string,
    public primerApellido: string,
    public segundoApellido: string,
    public numeroCelular: string | null,
    public email: string,
    public fechaNacimiento: string,
    public direccion: string,
    public ciudadDireccion: string,
    public departamentoDireccion: string,
    public paisDireccion: string,
    public login: string,
    public solicitudes: SolicitudInterface[],
    public tipoMiembro: TipoMiembroModel,
    public usuarioCongregacion: UsuarioCongregacionInterface
  ) {}

  get pais(): string {
    return this.usuarioCongregacion?.pais?.pais || '';
  }

  get congregacion(): string {
    return this.usuarioCongregacion?.congregacion?.congregacion || '';
  }

  get campo(): string {
    return this.usuarioCongregacion?.campo?.campo || '';
  }

  get congregacionCompleta(): string {
    const pais = this.usuarioCongregacion?.pais?.pais || '';
    const congregacion = this.usuarioCongregacion?.congregacion?.congregacion || '';
    const campo = this.usuarioCongregacion?.campo?.campo || '';
    return `${pais} - ${campo} - ${congregacion}`.trim();
  }

  get estadoUltimaSolicitud(): string {
    return this.solicitudes.length > 0 ? this.solicitudes[this.solicitudes.length - 1].estado : '';
  }

  get nombreCompleto(): string {
    return `${this.primerNombre} ${this.segundoNombre} ${this.primerApellido} ${this.segundoApellido}`.trim();
  }

  get ultimaSolicitud(): SolicitudInterface | null {
    return this.solicitudes.length > 0 ? this.solicitudes[this.solicitudes.length - 1] : null;
  }
}
