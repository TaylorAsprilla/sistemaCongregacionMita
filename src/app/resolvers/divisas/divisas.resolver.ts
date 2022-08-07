import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DivisaService } from 'src/app/services/divisa/divisa.service';

@Injectable({
  providedIn: 'root',
})
export class DivisasResolver implements Resolve<any> {
  constructor(private divisasServises: DivisaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.divisasServises.listarDivisa().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
