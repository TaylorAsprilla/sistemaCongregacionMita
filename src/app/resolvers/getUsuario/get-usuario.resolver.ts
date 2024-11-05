import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioResolver  {
  constructor(private usuarioService: UsuarioService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UsuarioInterface> {
    const id = route.paramMap.get('id');

    if (id !== 'nuevo') {
      return this.usuarioService.getUsuario(Number(id));
    } else {
      return null;
    }
  }
}
