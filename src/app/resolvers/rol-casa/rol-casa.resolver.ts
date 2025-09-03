import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { RolCasaService } from 'src/app/services/rol-casa/rol-casa.service';

@Injectable({
  providedIn: 'root',
})
export class RolCasaResolver {
  private rolCasaService = inject(RolCasaService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.rolCasaService.getRolCasa().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
