import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DosisService } from 'src/app/services/dosis/dosis.service';

@Injectable({
  providedIn: 'root',
})
export class DosisResolver implements Resolve<boolean> {
  constructor(private dosisService: DosisService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.dosisService.getDosis().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
