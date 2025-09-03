import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GradoAcademicoService } from 'src/app/services/grado-academico/grado-academico.service';

@Injectable({
  providedIn: 'root',
})
export class GradoAcademicoResolver {
  private gradoAcademicoService = inject(GradoAcademicoService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.gradoAcademicoService.getGradosAcademicos().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
