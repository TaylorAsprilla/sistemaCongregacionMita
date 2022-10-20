import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneroService } from 'src/app/services/genero/genero.service';

@Injectable({
  providedIn: 'root',
})
export class GeneroResolver implements Resolve<boolean> {
  constructor(private generoServices: GeneroService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.generoServices.getGeneros().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
