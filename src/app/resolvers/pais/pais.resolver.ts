import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaisService } from 'src/app/services/pais/pais.service';

@Injectable({
  providedIn: 'root',
})
export class PaisResolver {
  private paisService = inject(PaisService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.paisService.getPaises().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
