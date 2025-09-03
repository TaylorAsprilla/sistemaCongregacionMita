import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VoluntariadoService } from 'src/app/services/voluntariado/voluntariado.service';

@Injectable({
  providedIn: 'root',
})
export class VoluntariadoResolver {
  private voluntariadoService = inject(VoluntariadoService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.voluntariadoService.getVoluntariados().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
