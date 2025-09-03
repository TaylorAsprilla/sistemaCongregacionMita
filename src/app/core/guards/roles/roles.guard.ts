import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkUserLogin(route);
  }

  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    let tienePermiso = false;
    const permisos = this.usuarioService.role;

    for (let [index, permiso] of route.data['role'].entries()) {
      const permisosUsuario = permisos.find((permisoAEncontrar: string) => permiso.toUpperCase() === permisoAEncontrar);

      if (permisosUsuario) {
        tienePermiso = true;
        break;
      }
    }

    if (!tienePermiso) {
      this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
    }
    return tienePermiso;
  }
}
