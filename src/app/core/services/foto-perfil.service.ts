import { HttpClient, HttpContext, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from 'environment';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { SKIP_LOADING } from '../interceptors/loading/loading.interceptor';
import { MENSAJES_FOTO } from '../utils/foto-perfil';

const url_api = `${environment.base_url}/foto-perfil`;

/** Tiempo que se recuerda que un usuario no tiene fotografía (evita consultas repetidas). */
const TTL_SIN_FOTO_MS = 5 * 60 * 1000;
/** Se renueva la URL firmada antes de que caduque. */
const MARGEN_EXPIRACION = 0.8;
const ESPERA_LOTE_MS = 30;
const MAX_IDS_LOTE = 100;

interface EntradaCache {
  foto: string | null;
  url: string | null;
  expira: number;
}

interface RespuestaFoto {
  ok: boolean;
  foto: string | null;
  url: string | null;
  expiraEn: number | null;
  /** true/false si el servidor lo sabe; null/undefined si no (migración pendiente o backend antiguo). */
  tourVisto?: boolean | null;
  message?: string;
}

interface RespuestaLote {
  ok: boolean;
  expiraEn?: number;
  fotos: Record<string, { foto: string; url: string }>;
}

export interface ProgresoSubida {
  progreso: number;
  resultado?: RespuestaFoto;
}

/**
 * Fuente única de verdad para las fotografías de perfil.
 *
 * - Resuelve en lote y con caché las URLs firmadas que usa `AvatarUsuarioComponent`.
 * - Publica `cambio` para que todos los avatares abiertos se actualicen al subir o eliminar.
 * - Las credenciales de AWS nunca llegan al navegador: solo se reciben URLs firmadas de corta vigencia.
 */
@Injectable({ providedIn: 'root' })
export class FotoPerfilService {
  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);

  private cache = new Map<number, EntradaCache>();
  private pendientes = new Map<number, Array<(url: string | null) => void>>();
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  /** Último cambio de fotografía realizado en esta sesión (id del usuario y nueva clave). */
  readonly cambio = signal<{ id: number; foto: string | null; revision: number }>({ id: 0, foto: null, revision: 0 });

  private get opciones() {
    return {
      headers: { 'x-token': this.usuarioService.token },
      context: new HttpContext().set(SKIP_LOADING, true),
    };
  }

  /**
   * Devuelve la URL de la fotografía del usuario o null si no tiene.
   * @param fotoConocida clave conocida (`null` = sin foto; `undefined` = desconocida, se consulta).
   */
  resolverUrl(usuarioId: number, fotoConocida?: string | null): Promise<string | null> {
    if (!usuarioId || fotoConocida === null) {
      return Promise.resolve(null);
    }
    const entrada = this.cache.get(usuarioId);
    if (entrada && entrada.expira > Date.now() && (fotoConocida === undefined || entrada.foto === fotoConocida)) {
      return Promise.resolve(entrada.url);
    }
    return new Promise((resolver) => {
      const lista = this.pendientes.get(usuarioId) ?? [];
      lista.push(resolver);
      this.pendientes.set(usuarioId, lista);
      this.temporizador ??= setTimeout(() => this.enviarLote(), ESPERA_LOTE_MS);
    });
  }

  /** Descarta la URL en caché (p. ej. si caducó y la imagen falló al cargar). */
  invalidar(usuarioId: number): void {
    this.cache.delete(usuarioId);
  }

  private async enviarLote(): Promise<void> {
    this.temporizador = undefined;
    const lote = this.pendientes;
    this.pendientes = new Map();
    const ids = [...lote.keys()];

    for (let i = 0; i < ids.length; i += MAX_IDS_LOTE) {
      const grupo = ids.slice(i, i + MAX_IDS_LOTE);
      try {
        const respuesta = await firstValueFrom(
          this.http.post<RespuestaLote>(`${url_api}/urls`, { ids: grupo }, this.opciones),
        );
        const vigenciaMs = (respuesta.expiraEn ?? 900) * 1000 * MARGEN_EXPIRACION;
        for (const id of grupo) {
          const dato = respuesta.fotos?.[id];
          const entrada: EntradaCache = dato
            ? { foto: dato.foto, url: dato.url, expira: Date.now() + vigenciaMs }
            : { foto: null, url: null, expira: Date.now() + TTL_SIN_FOTO_MS };
          this.cache.set(id, entrada);
          lote.get(id)?.forEach((resolver) => resolver(entrada.url));
        }
      } catch {
        // Si falla la consulta se muestran las iniciales; se reintentará en la próxima visualización.
        grupo.forEach((id) => lote.get(id)?.forEach((resolver) => resolver(null)));
      }
    }
  }

  consultarPropia(): Observable<RespuestaFoto> {
    return this.http.get<RespuestaFoto>(url_api, this.opciones);
  }

  /** Registra en el servidor que el usuario ya vio el tour guiado (así no se repite en otros navegadores). */
  marcarTourVisto(): Observable<{ ok: boolean; guardado: boolean }> {
    return this.http.post<{ ok: boolean; guardado: boolean }>(`${url_api}/tour-visto`, {}, this.opciones);
  }

  /** Sube la imagen ya recortada. Emite el progreso (0-100) y, al final, el resultado. */
  subir(imagen: Blob): Observable<ProgresoSubida> {
    return this.http
      .post(url_api, imagen, {
        ...this.opciones,
        headers: { 'x-token': this.usuarioService.token, 'Content-Type': imagen.type || 'application/octet-stream' },
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((evento): ProgresoSubida | null => {
          if (evento.type === HttpEventType.UploadProgress) {
            const total = evento.total ?? imagen.size;
            return { progreso: Math.min(99, Math.round((evento.loaded / total) * 100)) };
          }
          if (evento.type === HttpEventType.Response) {
            return { progreso: 100, resultado: evento.body as RespuestaFoto };
          }
          return null;
        }),
        filter((valor): valor is ProgresoSubida => valor !== null),
        tap((valor) => {
          if (valor.resultado) {
            this.aplicarCambio(valor.resultado);
          }
        }),
      );
  }

  eliminar(): Observable<RespuestaFoto> {
    return this.http.delete<RespuestaFoto>(url_api, this.opciones).pipe(
      tap(() => this.aplicarCambio({ ok: true, foto: null, url: null, expiraEn: null })),
    );
  }

  /** Traduce errores HTTP a mensajes para el usuario. */
  mensajeDeError(error: unknown, porDefecto: string = MENSAJES_FOTO.subida): string {
    if (!(error instanceof HttpErrorResponse)) {
      return porDefecto;
    }
    switch (error.error?.code) {
      case 'IMAGEN_MUY_GRANDE':
        return MENSAJES_FOTO.tamano;
      case 'FORMATO_NO_PERMITIDO':
        return MENSAJES_FOTO.formato;
      case 'IMAGEN_MUY_PEQUENA':
        return MENSAJES_FOTO.dimension;
      case 'IMAGEN_CORRUPTA':
      case 'IMAGEN_VACIA':
        return MENSAJES_FOTO.corrupta;
    }
    if (error.status === 0) {
      return 'No hay conexión con el servidor. Verifique su internet e intente nuevamente.';
    }
    if (error.status === 413) return MENSAJES_FOTO.tamano;
    if (error.status === 403) return 'No tiene permisos para modificar esta fotografía.';
    return typeof error.error?.message === 'string' && error.status < 500 ? error.error.message : porDefecto;
  }

  private aplicarCambio(respuesta: RespuestaFoto): void {
    const id = this.usuarioService.usuarioId;
    if (!id) return;

    this.cache.set(
      id,
      respuesta.foto && respuesta.url
        ? { foto: respuesta.foto, url: respuesta.url, expira: Date.now() + (respuesta.expiraEn ?? 900) * 1000 * MARGEN_EXPIRACION }
        : { foto: null, url: null, expira: Date.now() + TTL_SIN_FOTO_MS },
    );

    // Mantiene el usuario en memoria al día para header, sidebar y demás componentes.
    if (this.usuarioService.usuario) {
      this.usuarioService.usuario.foto = respuesta.foto;
    }
    this.cambio.update((anterior) => ({ id, foto: respuesta.foto, revision: anterior.revision + 1 }));
  }
}
