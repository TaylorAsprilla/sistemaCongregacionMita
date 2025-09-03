import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneroService } from 'src/app/services/genero/genero.service';

@Injectable({
  providedIn: 'root',
})
export class GeneroResolver {
  private generoServices = inject(GeneroService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.generoServices.getGeneros().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
