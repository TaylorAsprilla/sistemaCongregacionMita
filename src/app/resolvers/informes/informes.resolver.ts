import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InformeService } from 'src/app/services/informe/informe.service';

@Injectable({
  providedIn: 'root',
})
export class InformesResolver implements Resolve<any> {
  constructor(private informeService: InformeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.informeService.getInformes().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
