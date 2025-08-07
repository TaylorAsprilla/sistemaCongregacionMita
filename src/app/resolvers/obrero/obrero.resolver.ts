import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ObreroModel } from 'src/app/core/models/obrero.model';
import { ObreroService } from 'src/app/services/obrero/obrero.service';

@Injectable({
  providedIn: 'root',
})
export class ObreroResolver {
  private obreroService = inject(ObreroService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ObreroModel[]> {
    return this.obreroService.getObreros().pipe(
      catchError((error) => {
        console.error('Error al obtener los obreros', error);
        return of([]); // En caso de error, devolver un arreglo vacío
      })
    );
  }
}
