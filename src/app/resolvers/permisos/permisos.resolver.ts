import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PermisoService } from 'src/app/services/permiso/permiso.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class PermisosResolver {
  private router = inject(Router);
  private permisoService = inject(PermisoService);
  private usuarioService = inject(UsuarioService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let idUsuario = 0;
    let usuario = this.usuarioService.usuario;

    if (!!usuario) {
      idUsuario = usuario.id;
    } else {
      idUsuario = 0;
    }

    return this.permisoService.getPermisosUsuario(idUsuario).pipe(
      catchError((error) => {
        this.router.navigateByUrl('/login');
        return of('No data');
      })
    );
  }
}
