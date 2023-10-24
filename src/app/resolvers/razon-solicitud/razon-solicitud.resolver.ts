import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RazonSolicitudModel } from 'src/app/core/models/razon-solicitud.model';
import { RazonSolicitudService } from 'src/app/services/razon-solicitud/razon-solicitud.service';

@Injectable({
  providedIn: 'root',
})
export class RazonSolicitudResolver implements Resolve<RazonSolicitudModel[]> {
  constructor(private razonsolicitudService: RazonSolicitudService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RazonSolicitudModel[]> {
    return this.razonsolicitudService.getRazonsolicitud().pipe(
      map((razones: RazonSolicitudModel[]) => razones.filter((razon) => razon.estado === true)),
      catchError((error) => {
        return of([]);
      })
    );
  }
}
