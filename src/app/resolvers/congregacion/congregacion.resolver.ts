import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';

@Injectable({
  providedIn: 'root',
})
export class CongregacionResolver  {
  constructor(private congregionService: CongregacionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.congregionService.getCongregaciones().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
