import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ObreroInterface } from 'src/app/core/models/obrero.model';

import { ObreroService } from 'src/app/services/obrero/obrero.service';

@Injectable({
  providedIn: 'root',
})
export class ObreroResolver {
  constructor(private obreroService: ObreroService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ObreroInterface[]> {
    return this.obreroService.getObreros().pipe(
      catchError((error) => {
        console.error('Error al obtener los obreros', error);
        return of([]); // En caso de error, devolver un arreglo vacío
      })
    );
  }
}
