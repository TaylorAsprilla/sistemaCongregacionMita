import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LinkEventosService } from 'src/app/services/link-eventos/link-eventos.service';

@Injectable({
  providedIn: 'root',
})
export class LinkEventosResolver implements Resolve<boolean> {
  constructor(private linkEventosService: LinkEventosService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.linkEventosService.getEventos().pipe(
      catchError((error) => {
        return of('No dara');
      })
    );
  }
}
