import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FuenteIngresoService } from 'src/app/services/fuente-ingreso/fuente-ingreso.service';

@Injectable({
  providedIn: 'root',
})
export class FuenteIngresoResolver implements Resolve<boolean> {
  constructor(private fuenteIngresoService: FuenteIngresoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.fuenteIngresoService.getFuenteDeIngresos().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
