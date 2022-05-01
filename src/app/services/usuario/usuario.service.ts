import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ListarUsuario, UsuarioInterface } from 'src/app/interfaces/usuario.interface';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment';

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

  get usuarioId(): string {
    return this.usuario.id || '';
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
          console.log(respuesta);
          const {
            id,
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
            numeroDocumento,
            nacionalidad,
            email,
            numeroCelular,
            fechaNacimiento,
            login,
            password,
            foto,
            estado,
            genero_id,
            tipoDocumento_id,
            pais_id,
          } = respuesta.usuario;

          this.usuario = new UsuarioModel(
            id,
            primerNombre,
            primerApellido,
            nacionalidad,
            email,
            numeroCelular,
            fechaNacimiento,
            estado,
            genero_id,
            pais_id,
            segundoNombre,
            segundoApellido,
            numeroDocumento,
            login,
            password,
            foto,
            tipoDocumento_id
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
    return this.httpClient.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        resp;
      })
    );
  }

  login(formData: LoginForm) {
    return this.httpClient.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
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
              usuario.nacionalidad,
              usuario.email,
              usuario.numeroCelular,
              usuario.fechaNacimiento,
              usuario.estado,
              usuario.genero_id,
              usuario.pais_id,
              usuario.segundoNombre,
              usuario.segundoApellido,
              usuario.numeroDocumento,
              usuario.login,
              usuario.password,
              usuario.foto,
              usuario.tipoDocumento_id
            )
        );
        return { totalUsuarios: usuariosRespuesta.totalUsuarios, usuarios };
      })
    );
  }

  listarTodosLosUsuarios() {
    return this.httpClient.get<ListarUsuario>(`${base_url}/usuarios/todos`, this.headers).pipe(
      map((usuariosRespuesta) => {
        const usuarios = usuariosRespuesta.usuarios.map(
          (usuario) =>
            new UsuarioModel(
              usuario.id,
              usuario.primerNombre,
              usuario.primerApellido,
              usuario.nacionalidad,
              usuario.email,
              usuario.numeroCelular,
              usuario.fechaNacimiento,
              usuario.estado,
              usuario.genero_id,
              usuario.pais_id,
              usuario.segundoNombre,
              usuario.segundoApellido,
              usuario.numeroDocumento,
              usuario.login,
              usuario.password,
              usuario.foto,
              usuario.tipoDocumento_id
            )
        );
        return { totalUsuarios: usuariosRespuesta.totalUsuarios, usuarios };
      })
    );
  }

  getUsuario(id: string) {
    return this.httpClient
      .get<UsuarioInterface>(`${base_url}/usuarios/${id}`, this.headers)
      .pipe(map((usuario: UsuarioInterface) => usuario));
  }

  eliminarUsuario(usuario: UsuarioModel) {
    return this.httpClient.delete(`${base_url}/usuarios/${usuario.id}`, this.headers);
  }

  actualizarUsuario(usuario: UsuarioModel, id: string) {
    console.log('email', usuario);
    return this.httpClient.put(`${base_url}/usuarios/${id}`, usuario, this.headers);
  }
}
