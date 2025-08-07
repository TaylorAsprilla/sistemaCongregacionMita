import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoMiembroService } from 'src/app/services/tipo-miembro/tipo-miembro.service';

@Injectable({
  providedIn: 'root',
})
export class TipoMiembroResolver {
  private tipoMiembroService = inject(TipoMiembroService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.tipoMiembroService.getTipoMiembro().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
