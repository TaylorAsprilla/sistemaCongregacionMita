import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ListarUsuario, UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { LoginForm } from 'src/app/core/interfaces/login-form.interface';
import { RegisterFormInterface } from 'src/app/core/interfaces/register-form.interface';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { environment } from 'environment';
import { MultimediaCmarLiveModel } from 'src/app/core/models/acceso-multimedia.model';
import { SolicitudMultimediaComponent } from 'src/app/pages/multimedia/solicitud-multimedia/solicitud-multimedia.component';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario: UsuarioModel;
  public idUsuario: number;
  public usuarioMultimedia: MultimediaCmarLiveModel;

  constructor(private httpClient: HttpClient, private router: Router) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get usuarioId(): number {
    return this.usuario.id || null;
  }

  get usuarioLogin() {
    return this.usuario || this.usuarioMultimedia;
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
          if (!!respuesta.accesoMultimedia) {
            const { id, nombre, celular, email, direccion, ciudad, departamento, solicitud_id, tiempoAprobacion_id } =
              respuesta.usuario;
            this.usuario = null;

            this.usuarioMultimedia = new MultimediaCmarLiveModel(
              id,
              nombre,
              celular,
              email,
              direccion,
              ciudad,
              departamento,
              solicitud_id,
              tiempoAprobacion_id
            );
            console.log('this.usuarioMultimedia ', this.usuarioMultimedia);

            localStorage.setItem('token', respuesta.token);
            return true;
          } else {
            const {
              id,
              primerNombre,
              primerApellido,
              email,
              numeroCelular,
              fechaNacimiento,
              esJoven,
              estado,
              genero_id,
              estadoCivil_id,
              vacuna_id,
              dosis_id,
              tipoMiembro_id,
              segundoNombre,
              segundoApellido,
              apodo,
              ingresoMensual,
              especializacionEmpleo,
              telefonoCasa,
              login,
              password,
              foto,
              rolCasa_id,
              nacionalidad_id,
              gradoAcademico_id,
              tipoEmpleo_id,
              genero,
              estadoCivil,
              rolCasa,
              vacuna,
              dosis,
              nacionalidad,
              gradoAcademico,
              tipoEmpleo,
              tipoMiembro,
              direcciones,
              usuarioCongregacion,
              usuarioMinisterio,
              usuarioPermiso,
            } = respuesta.usuario;

            this.usuario = new UsuarioModel(
              id,
              primerNombre,
              primerApellido,
              email,
              numeroCelular,
              fechaNacimiento,
              esJoven,
              estado,
              genero_id,
              estadoCivil_id,
              vacuna_id,
              dosis_id,
              tipoMiembro_id,
              segundoNombre,
              segundoApellido,
              apodo,
              ingresoMensual,
              especializacionEmpleo,
              telefonoCasa,
              login,
              password,
              foto,
              rolCasa_id,
              nacionalidad_id,
              gradoAcademico_id,
              tipoEmpleo_id,
              genero,
              estadoCivil,
              rolCasa,
              vacuna,
              dosis,
              nacionalidad,
              gradoAcademico,
              tipoEmpleo,
              tipoMiembro,
              direcciones,
              usuarioCongregacion,
              usuarioMinisterio,
              usuarioPermiso
            );

            localStorage.setItem('token', respuesta.token);
            return true;
          }
        }),

        catchError((error) => {
          console.log(error);
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
        if (!!resp.loginUsuarioCmarLive) {
          sessionStorage.setItem('nombre', resp.usuario.nombre);
          sessionStorage.setItem('email', resp.usuario.email);
          sessionStorage.setItem('celular', resp.usuario.celular);
          localStorage.setItem('token', resp.token);
          this.idUsuario = resp.usuario.id;
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
              usuario.esJoven,
              usuario.estado,
              usuario.genero_id,
              usuario.estadoCivil_id,
              usuario.vacuna_id,
              usuario.dosis_id,
              usuario.tipoMiembro_id,
              usuario.segundoNombre,
              usuario.segundoApellido,
              usuario.apodo,
              usuario.ingresoMensual,
              usuario.especializacionEmpleo,
              usuario.telefonoCasa,
              usuario.login,
              usuario.password,
              usuario.foto,
              usuario.rolCasa_id,
              usuario.nacionalidad_id,
              usuario.gradoAcademico_id,
              usuario.tipoEmpleo_id,
              usuario.genero,
              usuario.estadoCivil,
              usuario.rolCasa,
              usuario.vacuna,
              usuario.dosis,
              usuario.nacionalidad,
              usuario.gradoAcademico,
              usuario.tipoEmpleo,
              usuario.tipoMiembro,
              usuario.direcciones,
              usuario.usuarioCongregacion,
              usuario.usuarioMinisterio,
              usuario.usuarioPermiso
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
              usuario.esJoven,
              usuario.estado,
              usuario.genero_id,
              usuario.estadoCivil_id,
              usuario.vacuna_id,
              usuario.dosis_id,
              usuario.tipoMiembro_id,
              usuario.segundoNombre,
              usuario.segundoApellido,
              usuario.apodo,
              usuario.ingresoMensual,
              usuario.especializacionEmpleo,
              usuario.telefonoCasa,
              usuario.login,
              usuario.password,
              usuario.foto,
              usuario.rolCasa_id,
              usuario.nacionalidad_id,
              usuario.gradoAcademico_id,
              usuario.tipoEmpleo_id,
              usuario.genero,
              usuario.estadoCivil,
              usuario.rolCasa,
              usuario.vacuna,
              usuario.dosis,
              usuario.nacionalidad,
              usuario.gradoAcademico,
              usuario.tipoEmpleo,
              usuario.tipoMiembro,
              usuario.direcciones,
              usuario.usuarioCongregacion,
              usuario.usuarioMinisterio,
              usuario.usuarioPermiso
            )
        );
        return {
          totalUsuarios: usuariosRespuesta.totalUsuarios,
          usuarios,
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
