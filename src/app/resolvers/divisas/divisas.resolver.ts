import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DivisaService } from 'src/app/services/divisa/divisa.service';

@Injectable({
  providedIn: 'root',
})
export class DivisasResolver implements Resolve<any> {
  constructor(private divisasServise: DivisaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.divisasServise.listarDivisa().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
