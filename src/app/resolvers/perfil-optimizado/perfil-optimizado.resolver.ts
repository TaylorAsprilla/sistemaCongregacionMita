import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CatalogoCacheService, CatalogosCompletos } from 'src/app/core/services/catalogo-cache.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';

export interface PerfilData {
  catalogos: CatalogosCompletos;
  usuario: UsuarioInterface | null;
}

/**
 * Resolver optimizado para el perfil que carga todos los datos necesarios
 * usando caché para reducir la carga del servidor.
 */
@Injectable({
  providedIn: 'root',
})
export class PerfilOptimizadoResolver {
  private catalogoCacheService = inject(CatalogoCacheService);
  private usuarioService = inject(UsuarioService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PerfilData> {
    const userId = route.paramMap.get('id');

    return forkJoin({
      // Obtiene todos los catálogos en paralelo (con caché)
      catalogos: this.catalogoCacheService.obtenerTodosCatalogos(),
      // Obtiene el usuario específico
      usuario: this.usuarioService.getUsuario(Number(userId)).pipe(
        catchError((error) => {
          console.error('Error al cargar usuario:', error);
          return of(null);
        }),
      ),
    }).pipe(
      catchError((error) => {
        console.error('Error en PerfilOptimizadoResolver:', error);
        return of({
          catalogos: {
            nacionalidades: [],
            estadoCivil: [],
            generos: [],
            rolCasa: [],
            gradosAcademicos: [],
            congregaciones: [],
            tipoMiembros: [],
            ministerios: [],
            voluntariados: [],
            paises: [],
            campos: [],
            tiposDeDocumentos: [],
            categoriasProfesion: [],
          },
          usuario: null,
        });
      }),
    );
  }
}
