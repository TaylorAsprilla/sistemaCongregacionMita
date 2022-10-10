import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RazonSolicitudService } from 'src/app/services/razon-solicitud/razon-solicitud.service';

@Injectable({
  providedIn: 'root',
})
export class RazonSolicitudResolver implements Resolve<boolean> {
  constructor(private razonsolicitudService: RazonSolicitudService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.razonsolicitudService.getRazonsolicitud().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
