import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaisService } from 'src/app/services/pais/pais.service';

@Injectable({
  providedIn: 'root',
})
export class PaisResolver implements Resolve<boolean> {
  constructor(private paisService: PaisService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.paisService.getPaises().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
