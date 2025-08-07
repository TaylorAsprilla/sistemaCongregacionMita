import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OpcionTransporteService } from 'src/app/services/opcion-transporte/opcion-transporte.service';

@Injectable({
  providedIn: 'root',
})
export class OpcionTransporteResolver {
  private opcionTransporteService = inject(OpcionTransporteService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.opcionTransporteService.getOpcionTransporte().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
