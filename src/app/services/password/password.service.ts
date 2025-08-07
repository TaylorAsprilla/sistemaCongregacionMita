import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from 'src/app/core/models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private httpClient = inject(HttpClient);

  cambioPassword(usuario: UsuarioModel) {
    return this.httpClient.put(`${base_url}/password`, usuario);
  }
}
