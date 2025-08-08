import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NacionalidadService } from 'src/app/services/nacionalidad/nacionalidad.service';

@Injectable({
  providedIn: 'root',
})
export class NacionalidadResolver {
  private nacionalidadServices = inject(NacionalidadService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.nacionalidadServices.getNacionalidades().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
