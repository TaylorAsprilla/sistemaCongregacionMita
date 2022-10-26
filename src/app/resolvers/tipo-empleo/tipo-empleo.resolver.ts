import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoEmpleoService } from 'src/app/services/tipo-empleo/tipo-empleo.service';

@Injectable({
  providedIn: 'root',
})
export class TipoEmpleoResolver implements Resolve<any> {
  constructor(private tipoEmpleoService: TipoEmpleoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.tipoEmpleoService.getTipoDeEmpleos().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
