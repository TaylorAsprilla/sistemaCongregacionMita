import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ParentescoService } from 'src/app/services/parentesto/parentesco.service';

@Injectable({
  providedIn: 'root',
})
export class ParentescoResolver implements Resolve<boolean> {
  constructor(private parentescoService: ParentescoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.parentescoService.getParentescos().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
