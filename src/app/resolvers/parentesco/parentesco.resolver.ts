import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParentescoService } from 'src/app/services/parentesco/parentesco.service';

@Injectable({
  providedIn: 'root',
})
export class ParentescoResolver {
  private parentescoService = inject(ParentescoService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.parentescoService.getParentesco().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
