import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from 'src/app/core/models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private httpClient: HttpClient) {}

  cambioPassword(usuario: UsuarioModel) {
    return this.httpClient.put(`${base_url}/password`, usuario);
  }
}
