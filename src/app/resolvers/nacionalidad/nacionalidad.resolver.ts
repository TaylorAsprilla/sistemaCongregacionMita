import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NacionalidadService } from 'src/app/services/nacionalidad/nacionalidad.service';

@Injectable({
  providedIn: 'root',
})
export class NacionalidadResolver implements Resolve<boolean> {
  constructor(private nacionalidadServices: NacionalidadService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.nacionalidadServices.getNacionalidades().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
