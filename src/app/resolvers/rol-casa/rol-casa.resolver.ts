import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { RolCasaService } from 'src/app/services/rol-casa/rol-casa.service';

@Injectable({
  providedIn: 'root',
})
export class RolCasaResolver implements Resolve<boolean> {
  constructor(private rolCasaService: RolCasaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.rolCasaService.getRolCasa().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
