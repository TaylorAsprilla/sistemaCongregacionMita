import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VacunaService } from 'src/app/services/vacuna/vacuna.service';

@Injectable({
  providedIn: 'root',
})
export class VacunaResolver implements Resolve<boolean> {
  constructor(private vacunaService: VacunaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.vacunaService.getVacunas().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
