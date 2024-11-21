import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CampoService } from 'src/app/services/campo/campo.service';

@Injectable({
  providedIn: 'root',
})
export class CampoResolver  {
  constructor(private campoService: CampoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.campoService.getCampos().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
