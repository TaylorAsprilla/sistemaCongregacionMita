import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PermisoService } from 'src/app/services/permiso/permiso.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class PermisosResolver implements Resolve<boolean> {
  constructor(private router: Router, private permisoService: PermisoService, private usuarioService: UsuarioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let usuario = this.usuarioService.usuario;
    const id = usuario?.id ? usuario.id : 0;

    return this.permisoService.getPermisosUsuario(id).pipe(
      catchError((error) => {
        this.router.navigateByUrl('/login');
        return of('No data');
      })
    );
  }
}
