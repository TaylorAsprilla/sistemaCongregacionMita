import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentoResolver {
  private tipoDocumentoService = inject(TipoDocumentoService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.tipoDocumentoService.getTiposDeDocumentos().pipe(
      catchError((error) => {
        return of('No data');
      })
    );
  }
}
