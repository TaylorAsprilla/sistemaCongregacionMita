import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoEstudioService } from 'src/app/services/tipo-estudio/tipo-estudio.service';

@Injectable({
  providedIn: 'root',
})
export class TipoEstudioResolver {
  private tipoEstudioService = inject(TipoEstudioService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.tipoEstudioService.getTipoEstudio().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
