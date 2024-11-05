import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioResolver implements Resolve<UsuarioInterface | null> {
  constructor(private usuarioService: UsuarioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UsuarioInterface | null> {
    const id = route.paramMap.get('id');

    if (id !== 'nuevo') {
      return this.usuarioService.getUsuario(Number(id));
    } else {
      return of(null);
    }
  }
}
