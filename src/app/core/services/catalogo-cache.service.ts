import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { NacionalidadService } from 'src/app/services/nacionalidad/nacionalidad.service';
import { EstadoCivilService } from 'src/app/services/estado-civil/estado-civil.service';
import { GeneroService } from 'src/app/services/genero/genero.service';
import { RolCasaService } from 'src/app/services/rol-casa/rol-casa.service';
import { GradoAcademicoService } from 'src/app/services/grado-academico/grado-academico.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { TipoMiembroService } from 'src/app/services/tipo-miembro/tipo-miembro.service';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';
import { VoluntariadoService } from 'src/app/services/voluntariado/voluntariado.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { CampoService } from 'src/app/services/campo/campo.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';
import { CategoriaProfesionService } from 'src/app/services/categoria-profesion/categoria-profesion.service';
import { NacionalidadModel } from '../models/nacionalidad.model';
import { EstadoCivilModel } from '../models/estado-civil.model';
import { GeneroModel } from '../models/genero.model';
import { RolCasaModel } from '../models/rol-casa.model';
import { GradoAcademicoModel } from '../models/grado-academico.model';
import { CongregacionModel } from '../models/congregacion.model';
import { TipoMiembroModel } from '../models/tipo.miembro.model';
import { MinisterioModel } from '../models/ministerio.model';
import { VoluntariadoModel } from '../models/voluntariado.model';
import { CongregacionPaisModel } from '../models/congregacion-pais.model';
import { CampoModel } from '../models/campo.model';
import { TipoDocumentoModel } from '../models/tipo-documento.model';
import { CategoriaProfesionModel } from '../models/categoria-profesion.model';

export interface CatalogosCompletos {
  nacionalidades: NacionalidadModel[];
  estadoCivil: EstadoCivilModel[];
  generos: GeneroModel[];
  rolCasa: RolCasaModel[];
  gradosAcademicos: GradoAcademicoModel[];
  congregaciones: CongregacionModel[];
  tipoMiembros: TipoMiembroModel[];
  ministerios: MinisterioModel[];
  voluntariados: VoluntariadoModel[];
  paises: CongregacionPaisModel[];
  campos: CampoModel[];
  tiposDeDocumentos: TipoDocumentoModel[];
  categoriasProfesion: CategoriaProfesionModel[];
}

/**
 * Servicio centralizado para cachear catálogos que rara vez cambian.
 * Reduce la carga del servidor al evitar múltiples llamadas HTTP redundantes.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogoCacheService {
  private nacionalidadService = inject(NacionalidadService);
  private estadoCivilService = inject(EstadoCivilService);
  private generoService = inject(GeneroService);
  private rolCasaService = inject(RolCasaService);
  private gradoAcademicoService = inject(GradoAcademicoService);
  private congregacionService = inject(CongregacionService);
  private tipoMiembroService = inject(TipoMiembroService);
  private ministerioService = inject(MinisterioService);
  private voluntariadoService = inject(VoluntariadoService);
  private paisService = inject(PaisService);
  private campoService = inject(CampoService);
  private tipoDocumentoService = inject(TipoDocumentoService);
  private categoriaProfesionService = inject(CategoriaProfesionService);

  // Cachés individuales con shareReplay para evitar múltiples llamadas
  private nacionalidadesCache$: Observable<NacionalidadModel[]> | null = null;
  private estadoCivilCache$: Observable<EstadoCivilModel[]> | null = null;
  private generosCache$: Observable<GeneroModel[]> | null = null;
  private rolCasaCache$: Observable<RolCasaModel[]> | null = null;
  private gradosAcademicosCache$: Observable<GradoAcademicoModel[]> | null = null;
  private congregacionesCache$: Observable<CongregacionModel[]> | null = null;
  private tipoMiembrosCache$: Observable<TipoMiembroModel[]> | null = null;
  private ministeriosCache$: Observable<MinisterioModel[]> | null = null;
  private voluntariadosCache$: Observable<VoluntariadoModel[]> | null = null;
  private paisesCache$: Observable<CongregacionPaisModel[]> | null = null;
  private camposCache$: Observable<CampoModel[]> | null = null;
  private tiposDeDocumentosCache$: Observable<TipoDocumentoModel[]> | null = null;
  private categoriasProfesionCache$: Observable<CategoriaProfesionModel[]> | null = null;

  // Caché consolidado de todos los catálogos
  private catalogosCompletosCache$: Observable<CatalogosCompletos> | null = null;

  /**
   * Obtiene todos los catálogos en una sola llamada optimizada.
   * Los datos se cachean y solo se cargan una vez.
   */
  obtenerTodosCatalogos(): Observable<CatalogosCompletos> {
    if (!this.catalogosCompletosCache$) {
      this.catalogosCompletosCache$ = forkJoin({
        nacionalidades: this.obtenerNacionalidades(),
        estadoCivil: this.obtenerEstadoCivil(),
        generos: this.obtenerGeneros(),
        rolCasa: this.obtenerRolCasa(),
        gradosAcademicos: this.obtenerGradosAcademicos(),
        congregaciones: this.obtenerCongregaciones(),
        tipoMiembros: this.obtenerTipoMiembros(),
        ministerios: this.obtenerMinisterios(),
        voluntariados: this.obtenerVoluntariados(),
        paises: this.obtenerPaises(),
        campos: this.obtenerCampos(),
        tiposDeDocumentos: this.obtenerTiposDeDocumentos(),
        categoriasProfesion: this.obtenerCategoriasProfesion(),
      }).pipe(
        shareReplay(1), // Cachea el resultado
        catchError((error) => {
          console.error('Error al cargar catálogos:', error);
          // Si falla, limpia el caché para permitir retry
          this.catalogosCompletosCache$ = null;
          throw error;
        }),
      );
    }
    return this.catalogosCompletosCache$;
  }

  // Métodos individuales para obtener cada catálogo con caché

  obtenerNacionalidades(): Observable<NacionalidadModel[]> {
    if (!this.nacionalidadesCache$) {
      this.nacionalidadesCache$ = this.nacionalidadService.getNacionalidades().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.nacionalidadesCache$;
  }

  obtenerEstadoCivil(): Observable<EstadoCivilModel[]> {
    if (!this.estadoCivilCache$) {
      this.estadoCivilCache$ = this.estadoCivilService.getEstadoCiviles().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.estadoCivilCache$;
  }

  obtenerGeneros(): Observable<GeneroModel[]> {
    if (!this.generosCache$) {
      this.generosCache$ = this.generoService.getGeneros().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.generosCache$;
  }

  obtenerRolCasa(): Observable<RolCasaModel[]> {
    if (!this.rolCasaCache$) {
      this.rolCasaCache$ = this.rolCasaService.getRolCasa().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.rolCasaCache$;
  }

  obtenerGradosAcademicos(): Observable<GradoAcademicoModel[]> {
    if (!this.gradosAcademicosCache$) {
      this.gradosAcademicosCache$ = this.gradoAcademicoService.getGradosAcademicos().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.gradosAcademicosCache$;
  }

  obtenerCongregaciones(): Observable<CongregacionModel[]> {
    if (!this.congregacionesCache$) {
      this.congregacionesCache$ = this.congregacionService.getCongregaciones().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.congregacionesCache$;
  }

  obtenerTipoMiembros(): Observable<TipoMiembroModel[]> {
    if (!this.tipoMiembrosCache$) {
      this.tipoMiembrosCache$ = this.tipoMiembroService.getTipoMiembro().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.tipoMiembrosCache$;
  }

  obtenerMinisterios(): Observable<MinisterioModel[]> {
    if (!this.ministeriosCache$) {
      this.ministeriosCache$ = this.ministerioService.getMinisterios().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.ministeriosCache$;
  }

  obtenerVoluntariados(): Observable<VoluntariadoModel[]> {
    if (!this.voluntariadosCache$) {
      this.voluntariadosCache$ = this.voluntariadoService.getVoluntariados().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.voluntariadosCache$;
  }

  obtenerPaises(): Observable<CongregacionPaisModel[]> {
    if (!this.paisesCache$) {
      this.paisesCache$ = this.paisService.getPaises().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.paisesCache$;
  }

  obtenerCampos(): Observable<CampoModel[]> {
    if (!this.camposCache$) {
      this.camposCache$ = this.campoService.getCampos().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.camposCache$;
  }

  obtenerTiposDeDocumentos(): Observable<TipoDocumentoModel[]> {
    if (!this.tiposDeDocumentosCache$) {
      this.tiposDeDocumentosCache$ = this.tipoDocumentoService.getTiposDeDocumentos().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.tiposDeDocumentosCache$;
  }

  obtenerCategoriasProfesion(): Observable<CategoriaProfesionModel[]> {
    if (!this.categoriasProfesionCache$) {
      this.categoriasProfesionCache$ = this.categoriaProfesionService.getCategoriasProfesion().pipe(
        shareReplay(1),
        catchError(() => of([])),
      );
    }
    return this.categoriasProfesionCache$;
  }

  /**
   * Limpia todos los cachés. Útil cuando se actualizan catálogos.
   */
  limpiarCache(): void {
    this.nacionalidadesCache$ = null;
    this.estadoCivilCache$ = null;
    this.generosCache$ = null;
    this.rolCasaCache$ = null;
    this.gradosAcademicosCache$ = null;
    this.congregacionesCache$ = null;
    this.tipoMiembrosCache$ = null;
    this.ministeriosCache$ = null;
    this.voluntariadosCache$ = null;
    this.paisesCache$ = null;
    this.camposCache$ = null;
    this.tiposDeDocumentosCache$ = null;
    this.categoriasProfesionCache$ = null;
    this.catalogosCompletosCache$ = null;
  }

  /**
   * Limpia un catálogo específico del caché.
   */
  limpiarCatalogoEspecifico(catalogo: keyof CatalogosCompletos): void {
    const cacheMap: Record<keyof CatalogosCompletos, string> = {
      nacionalidades: 'nacionalidadesCache$',
      estadoCivil: 'estadoCivilCache$',
      generos: 'generosCache$',
      rolCasa: 'rolCasaCache$',
      gradosAcademicos: 'gradosAcademicosCache$',
      congregaciones: 'congregacionesCache$',
      tipoMiembros: 'tipoMiembrosCache$',
      ministerios: 'ministeriosCache$',
      voluntariados: 'voluntariadosCache$',
      paises: 'paisesCache$',
      campos: 'camposCache$',
      tiposDeDocumentos: 'tiposDeDocumentosCache$',
      categoriasProfesion: 'categoriasProfesionCache$',
    };

    const cacheProperty = cacheMap[catalogo];
    if (cacheProperty) {
      (this as any)[cacheProperty] = null;
    }
    // También limpia el caché completo
    this.catalogosCompletosCache$ = null;
  }
}
