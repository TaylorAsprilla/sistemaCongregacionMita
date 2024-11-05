import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';

@Injectable({
  providedIn: 'root',
})
export class MinisterioResolver  {
  constructor(private ministerioService: MinisterioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.ministerioService.getMinisterios().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
