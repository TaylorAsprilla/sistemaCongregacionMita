import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ObreroService } from 'src/app/services/obrero/obrero.service';

@Injectable({
  providedIn: 'root',
})
export class ObreroResolver implements Resolve<boolean> {
  constructor(private obreroService: ObreroService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.obreroService.getObreros().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
