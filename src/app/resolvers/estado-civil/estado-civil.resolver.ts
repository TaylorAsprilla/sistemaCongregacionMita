import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EstadoCivilService } from 'src/app/services/estado-civil/estado-civil.service';

@Injectable({
  providedIn: 'root',
})
export class EstadoCivilResolver implements Resolve<boolean> {
  constructor(private estadoCivilServices: EstadoCivilService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.estadoCivilServices.getEstadoCiviles().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
