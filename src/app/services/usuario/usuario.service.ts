import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  ListarUsuario,
  UsuarioInterface,
  UsuariosPorCongregacionRespuesta,
} from 'src/app/core/interfaces/usuario.interface';
import { LoginForm } from 'src/app/core/interfaces/login-form.interface';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { environment } from 'environment';
import { MultimediaCongregacionModel } from 'src/app/core/models/acceso-multimedia.model';
import { configuracion } from 'src/environments/config/configuration';
import { CongregacionTransferirFeligresInterface } from 'src/app/core/interfaces/congregacion.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario: UsuarioModel;
  public idUsuario: number;
  public multimediaCongregacion: MultimediaCongregacionModel;
  public nombreQR: string;

  private inactiveTimeout: any;
  public timeRemaining: EventEmitter<number> = new EventEmitter<number>();
  private readonly INACTIVE_TIMEOUT_MS: number = configuracion.inactividad.INACTIVE_TIMEOUT_MS;
  private readonly timerModal: number = configuracion.inactividad.TIMER_MODEL;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.resetInactiveTimer();
    window.addEventListener('mousemove', () => this.resetInactiveTimer());
    window.addEventListener('keypress', () => this.resetInactiveTimer());
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get usuarioId(): number {
    return this.usuario?.id || this.multimediaCongregacion?.id;
  }

  get usuarioLogin() {
    return this.usuario?.login || this.multimediaCongregacion?.email;
  }

  get usuarioNombre(): string {
    return `${this.usuario.primerNombre} ${this.usuario.segundoNombre} ${this.usuario.primerApellido} ${this.usuario.segundoApellido}`;
  }

  get usuarioIdCongregacionPais(): number {
    return this.usuario.usuarioCongregacion.pais_id;
  }

  get usuarioIdCongregacion(): number {
    return this.usuario.usuarioCongregacion.congregacion_id;
  }

  get nombreCongregacionPais(): string {
    return this.usuario?.usuarioCongregacionPais[0].pais;
  }

  get nombreCongregacion(): string {
    return `${this.usuario?.usuarioCongregacionCongregacion[0].congregacion}, ${this.usuario?.usuarioCongregacionPais[0].pais} `;
  }

  get role() {
    return this.usuario.usuarioPermiso.map((permiso) => {
      return permiso.permiso;
    });
  }

  get isQRLogin() {
    return sessionStorage.getItem('isQRLogin') === 'isQRLogin';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  resetInactiveTimer(): void {
    if (this.inactiveTimeout !== null) {
      clearTimeout(this.inactiveTimeout);
    }
    this.inactiveTimeout = setTimeout(() => {
      this.showSessionExpirationAlert(); // Llama a la función en lugar de pasarla como referencia
    }, this.INACTIVE_TIMEOUT_MS);

    this.startCountdown();
  }

  startCountdown(): void {
    let remainingTime = this.INACTIVE_TIMEOUT_MS;
    const countdownInterval = setInterval(() => {
      remainingTime -= 1000;
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
      this.timeRemaining.emit(remainingTime);
    }, 1000);
  }

  showSessionExpirationAlert(): void {
    if (this.token != '') {
      let timerInterval: any;
      Swal.fire({
        title: '¡Atención!',
        html: 'Su sesión se cerrará automáticamente debido a inactividad en <b></b>',
        icon: 'warning',
        timer: this.timerModal,
        timerProgressBar: true,
        showCancelButton: true,
        cancelButtonText: 'Continuar en la sesión',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          const popup = Swal.getPopup();
          const timer = popup ? popup.querySelector('b') : null;
          if (timer) {
            timerInterval = setInterval(() => {
              const timeLeft = Swal.getTimerLeft();
              if (timeLeft !== null && timeLeft !== undefined) {
                const minutes = Math.floor(timeLeft / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);
                timer.textContent = `${minutes}m ${seconds}s`;
              }
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          this.logout();
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('isQRLogin');
    this.router.navigateByUrl('/login');
    sessionStorage.clear();
  }

  validarToken(): Observable<boolean> {
    return this.httpClient
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((respuesta: any) => {
          if (!!respuesta.congregacion && !sessionStorage.getItem('nombre')) {
            const { id, congregacion, email, pais_id, idObreroEncargado } = respuesta.congregacion;
            this.usuario = null;

            this.multimediaCongregacion = new MultimediaCongregacionModel(
              id,
              congregacion,
              email,
              pais_id,
              idObreroEncargado
            );

            localStorage.setItem('token', respuesta.token);
            return true;
          } else if (!!this.isQRLogin) {
            const { id, congregacion, email, pais_id, idObreroEncargado } = respuesta.congregacion;

            const nombre = sessionStorage.getItem('nombre') || '';
            this.nombreQR = nombre;

            this.multimediaCongregacion = new MultimediaCongregacionModel(
              id,
              congregacion,
              email,
              pais_id,
              idObreroEncargado
            );

            localStorage.setItem('token', localStorage.getItem('token'));
            return true;
          } else {
            const {
              id,
              primerNombre,
              primerApellido,
              numeroCelular,
              fechaNacimiento,
              estado,
              tipoMiembro,
              nacionalidad,
              rolCasa,
              esJoven,
              genero,
              password,
              numeroDocumento,
              segundoNombre,
              segundoApellido,
              apodo,
              email,
              login,
              foto,
              telefonoCasa,
              direccion,
              ciudadDireccion,
              departamentoDireccion,
              codigoPostalDireccion,
              paisDireccion,
              direccionPostal,
              ciudadPostal,
              departamentoPostal,
              codigoPostal,
              paisPostal,
              anoConocimiento,
              ocupacion,
              especializacionEmpleo,
              estadoCivil,
              gradoAcademico,
              tipoDocumento,
              usuarioCongregacion,
              usuarioMinisterio,
              usuarioVoluntariado,
              usuarioPermiso,
              usuarioCongregacionPais,
              usuarioCongregacionCongregacion,
              usuarioCongregacionCampo,
            } = respuesta.usuario;

            this.usuario = new UsuarioModel(
              id,
              primerNombre,
              primerApellido,
              numeroCelular,
              fechaNacimiento,
              estado,
              tipoMiembro,
              nacionalidad,
              rolCasa,
              esJoven,
              genero,
              '',
              numeroDocumento,
              segundoNombre,
              segundoApellido,
              apodo,
              email,
              login,
              foto,
              telefonoCasa,
              direccion,
              ciudadDireccion,
              departamentoDireccion,
              codigoPostalDireccion,
              paisDireccion,
              direccionPostal,
              ciudadPostal,
              departamentoPostal,
              codigoPostal,
              paisPostal,
              anoConocimiento,
              ocupacion,
              especializacionEmpleo,
              estadoCivil,
              gradoAcademico,
              tipoDocumento,
              usuarioCongregacion,
              usuarioMinisterio,
              usuarioVoluntariado,
              usuarioPermiso,
              usuarioCongregacionPais,
              usuarioCongregacionCongregacion,
              usuarioCongregacionCampo
            );

            localStorage.setItem('token', respuesta.token);

            return true;
          }
        }),

        catchError((error) => {
          return of(false);
        })
      );
  }

  crearUsuario(formData: RegisterFormInterface) {
    return this.httpClient.post(`${base_url}/usuarios`, formData, this.headers).pipe(
      tap((resp: any) => {
        resp;
      })
    );
  }

  login(formData: LoginForm) {
    return this.httpClient.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        if (!!resp.congregacion) {
          sessionStorage.setItem('congregacion', resp.congregacion.congregacion);
          sessionStorage.setItem('email', resp.congregacion.email);
          localStorage.setItem('token', resp.token);
          this.idUsuario = resp.congregacion.id;
        } else {
          sessionStorage.setItem('primerNombre', resp.usuario.primerNombre);
          sessionStorage.setItem('segundoNombre', resp.usuario.segundoNombre);
          sessionStorage.setItem('primerApellido', resp.usuario.primerApellido);
          sessionStorage.setItem('segundoApellido', resp.usuario.segundoApellido);
          localStorage.setItem('token', resp.token);
          this.idUsuario = resp.usuario.id;
        }
      })
    );
  }

  loginPorQr(ticket: string, nombre: string) {
    return this.httpClient.post(`${base_url}/accesoqr/loginQr`, { qrCode: ticket, nombre }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
        sessionStorage.setItem('isQRLogin', 'isQRLogin');
        sessionStorage.setItem('nombre', nombre);
        sessionStorage.setItem('congregacion', resp.congregacion.congregacion);
        this.idUsuario = resp.congregacion.id;
        this.nombreQR = resp.nombre;
      })
    );
  }

  forgotPassword(login: string) {
    return this.httpClient.put(`${base_url}/login/forgotpassword`, login, this.headers);
  }

  cambiarPassword(password: string, token: string) {
    return this.httpClient.put(
      `${base_url}/login/cambiarpassword`,
      { nuevoPassword: password },
      {
        headers: {
          'x-reset': token,
        },
      }
    );
  }

  cambiarPasswordUsuario(login: string, passwordAntiguo: string, passwordNuevo: string) {
    return this.httpClient.put(
      `${base_url}/login/cambiarpasswordusuario`,
      { passwordAntiguo, passwordNuevo, login },
      this.headers
    );
  }

  resetPassword(login: string, password: string) {
    return this.httpClient.put(
      `${base_url}/login/resetpassword`,
      { login: login, passwordNuevo: password },
      this.headers
    );
  }

  crearAcceso(idUsuario: number, login: string, password: string) {
    return this.httpClient.put(`${base_url}/login/crearlogin`, { idUsuario, login, password }, this.headers);
  }

  listarUsuarios(desde: number = 0) {
    return this.httpClient
      .get<UsuariosPorCongregacionRespuesta>(`${base_url}/usuarios?desde=${desde}`, this.headers)
      .pipe(
        map((usuariosRespuesta) => {
          return { totalUsuarios: usuariosRespuesta.totalUsuarios, usuarios: usuariosRespuesta.usuarios };
        })
      );
  }

  listarTodosLosUsuarios() {
    return this.httpClient.get<ListarUsuario>(`${base_url}/usuarios`, this.headers);
  }

  getUsuario(id: number) {
    return this.httpClient.get<UsuarioInterface>(`${base_url}/usuarios/${id}`, this.headers).pipe(
      map((usuario) => {
        return usuario;
      })
    );
  }

  buscarNumerosMitas(numerosMitas: number[], fechaNacimiento: Date): Observable<any> {
    const body = {
      numerosMitas,
      fechaNacimiento,
    };

    return this.httpClient.post(`${base_url}/usuarios/buscar-numeros-mitas`, body, this.headers);
  }

  eliminarUsuario(idUsuario: number) {
    return this.httpClient.delete(`${base_url}/usuarios/${idUsuario}`, this.headers);
  }

  actualizarUsuario(usuario: RegisterFormInterface, id: number) {
    return this.httpClient.put(`${base_url}/usuarios/${id}`, usuario, this.headers);
  }

  transferirUsuario(transferencia: CongregacionTransferirFeligresInterface, id: number) {
    return this.httpClient.put(`${base_url}/usuarios/transferir/${id}`, transferencia, this.headers);
  }

  transcenderUsuario(id: number) {
    return this.httpClient.put(`${base_url}/usuarios/transcender/${id}`, {}, this.headers);
  }

  actualizarPermisos(id: number, usuarioPermiso: number[]) {
    return this.httpClient.put(`${base_url}/usuarios/actualizarpermisos/${id}`, { usuarioPermiso }, this.headers);
  }

  activarUsuario(usuario: UsuarioModel) {
    return this.httpClient.put(`${base_url}/usuarios/activar/${usuario.id}`, usuario, this.headers);
  }
}
