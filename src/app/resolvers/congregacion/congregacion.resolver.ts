import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';

@Injectable({
  providedIn: 'root',
})
export class CongregacionResolver {
  private congregionService = inject(CongregacionService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.congregionService.getCongregaciones().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
