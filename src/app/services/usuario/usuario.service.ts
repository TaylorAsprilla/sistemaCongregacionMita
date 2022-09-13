import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ListarUsuario, UsuarioInterface } from 'src/app/interfaces/usuario.interface';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { environment } from 'environment';
import { UsuarioCongregacionModel } from 'src/app/models/usuarioCongregacion.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario: UsuarioModel;
  public idUsuario: number;

  constructor(private httpClient: HttpClient, private router: Router) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get usuarioId(): number {
    return this.usuario.id || null;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  logout() {
    localStorage.removeItem('token');
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
          const {
            id,
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
            numeroDocumento,
            email,
            numeroCelular,
            telefonoCasa,
            direccion,
            zipCode,
            fechaNacimiento,
            login,
            password,
            foto,
            estado,
            genero_id,
            tipoDocumento_id,
            pais_id,
            estadoCivil_id,
            rolCasa_id,
            vacuna_id,
            dosis_id,
            nacionalidad_id,
            indicativoCasa,
            indicativoCelular,
          } = respuesta.usuario;

          this.usuario = new UsuarioModel(
            id,
            primerNombre,
            primerApellido,
            email,
            numeroCelular,
            fechaNacimiento,
            estado,
            genero_id,
            estadoCivil_id,
            vacuna_id,
            dosis_id,
            segundoNombre,
            segundoApellido,
            numeroDocumento,
            telefonoCasa,
            direccion,
            zipCode,
            login,
            password,
            foto,
            tipoDocumento_id,
            rolCasa_id,
            nacionalidad_id,
            indicativoCasa,
            indicativoCelular
          );
          localStorage.setItem('token', respuesta.token);
          return true;
        }),

        catchError((error) => {
          console.log(error);
          return of(false);
        })
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.httpClient.post(`${base_url}/usuarios`, formData, this.headers).pipe(
      tap((resp: any) => {
        resp;
      })
    );
  }

  login(formData: LoginForm) {
    return this.httpClient.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        sessionStorage.setItem('primerNombre', resp.usuario.primerNombre);
        sessionStorage.setItem('segundoNombre', resp.usuario.segundoNombre);
        sessionStorage.setItem('primerApellido', resp.usuario.primerApellido);
        sessionStorage.setItem('segundoApellido', resp.usuario.segundoApellido);

        localStorage.setItem('token', resp.token);
        this.idUsuario = resp.usuario.id;
      })
    );
  }

  listarUsuarios(desde: number = 0) {
    return this.httpClient.get<ListarUsuario>(`${base_url}/usuarios?desde=${desde}`, this.headers).pipe(
      map((usuariosRespuesta) => {
        const usuarios = usuariosRespuesta.usuarios.map(
          (usuario) =>
            new UsuarioModel(
              usuario.id,
              usuario.primerNombre,
              usuario.primerApellido,
              usuario.email,
              usuario.numeroCelular,
              usuario.fechaNacimiento,
              usuario.estado,
              usuario.genero_id,
              usuario.estadoCivil_id,
              usuario.vacuna_id,
              usuario.dosis_id,
              usuario.segundoNombre,
              usuario.segundoApellido,
              usuario.numeroDocumento,
              usuario.telefonoCasa,
              usuario.direccion,
              usuario.zipCode,
              usuario.login,
              usuario.password,
              usuario.foto,
              usuario.tipoDocumento_id,
              usuario.rolCasa_id,
              usuario.nacionalidad_id,
              usuario.indicativoCasa,
              usuario.indicativoCelular
            )
        );
        return { totalUsuarios: usuariosRespuesta.totalUsuarios, usuarios };
      })
    );
  }

  listarTodosLosUsuarios() {
    return this.httpClient.get<ListarUsuario>(`${base_url}/usuarios`, this.headers).pipe(
      map((usuariosRespuesta) => {
        const usuarios = usuariosRespuesta.usuarios.map(
          (usuario) =>
            new UsuarioModel(
              usuario.id,
              usuario.primerNombre,
              usuario.primerApellido,
              usuario.email,
              usuario.numeroCelular,
              usuario.fechaNacimiento,
              usuario.estado,
              usuario.genero_id,
              usuario.estadoCivil_id,
              usuario.vacuna_id,
              usuario.dosis_id,
              usuario.segundoNombre,
              usuario.segundoApellido,
              usuario.numeroDocumento,
              usuario.telefonoCasa,
              usuario.direccion,
              usuario.zipCode,
              usuario.login,
              usuario.password,
              usuario.foto,
              usuario.tipoDocumento_id,
              usuario.rolCasa_id,
              usuario.nacionalidad_id,
              usuario.indicativoCasa,
              usuario.indicativoCelular
            )
        );
        return {
          totalUsuarios: usuariosRespuesta.totalUsuarios,
          usuarios,
          usuarioCongregacion: usuariosRespuesta.usuarioCongregacion,
        };
      })
    );
  }

  getUsuario(id: number) {
    return this.httpClient
      .get<UsuarioInterface>(`${base_url}/usuarios/${id}`, this.headers)
      .pipe(map((usuario) => usuario));
  }

  eliminarUsuario(usuario: UsuarioModel) {
    return this.httpClient.delete(`${base_url}/usuarios/${usuario.id}`, this.headers);
  }

  actualizarUsuario(usuario: UsuarioModel, id: number) {
    return this.httpClient.put(`${base_url}/usuarios/${id}`, usuario, this.headers);
  }

  activarUsuario(usuario: UsuarioModel) {
    return this.httpClient.put(`${base_url}/usuarios/activar/${usuario.id}`, usuario, this.headers);
  }
}
