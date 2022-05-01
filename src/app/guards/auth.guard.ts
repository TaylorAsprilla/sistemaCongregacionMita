import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return this.usuarioService.validarToken().pipe(
      tap((estaAutenticado) => {
        if (!estaAutenticado) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.usuarioService.validarToken().pipe(
      tap((estaAutenticado) => {
        if (!estaAutenticado) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
