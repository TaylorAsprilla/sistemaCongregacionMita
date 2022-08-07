import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SeccionInformeService } from 'src/app/services/seccion-informe/seccion-informe.service';

@Injectable({
  providedIn: 'root',
})
export class SeccionInformeResolver implements Resolve<boolean> {
  constructor(private seccionInformeService: SeccionInformeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.seccionInformeService.getSeccionesInformes().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
