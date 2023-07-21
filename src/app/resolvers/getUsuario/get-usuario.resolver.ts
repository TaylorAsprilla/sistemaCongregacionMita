import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioResolver implements Resolve<UsuarioInterface> {
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
