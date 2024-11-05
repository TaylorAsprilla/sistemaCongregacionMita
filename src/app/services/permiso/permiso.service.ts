import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PermisoUsuarioModel } from 'src/app/core/models/permiso-usuario.model';
import { PermisoModel } from 'src/app/core/models/permisos.model';
import { ROLES } from 'src/app/routes/menu-items';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  constructor(private httpClient: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  tienePermisos(idUsuario: string, permisos: ROLES[]) {
    return idUsuario && permisos.includes;
  }

  getPermisos() {
    return this.httpClient
      .get(`${base_url}/permiso`, this.headers)
      .pipe(map((permiso: { ok: boolean; permiso: PermisoModel[] }) => permiso.permiso));
  }

  getPermisosUsuario(idUsuario: number = 0) {
    return this.httpClient
      .get(`${base_url}/permiso/usuario/${idUsuario}`, this.headers)
      .pipe(map((permisos: { ok: boolean; permisos: PermisoUsuarioModel[] }) => permisos.permisos));
  }
}
