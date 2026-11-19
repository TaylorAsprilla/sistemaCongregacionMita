import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environment';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { SKIP_LOADING } from '../interceptors/loading/loading.interceptor';
import { FiltroNotificaciones, ListaNotificaciones, NotificacionModel } from '../models/notificacion.model';
import { urlDestinoSegura } from '../utils/notificaciones';

const url_api = `${environment.base_url}/notificaciones`;

/** Cada cuánto se consulta el contador mientras la pestaña está visible. */
export const INTERVALO_SONDEO_MS = 60_000;

/**
 * Fuente única de verdad del centro de notificaciones.
 *
 * Actualización automática por sondeo (polling) del contador: es la opción que no exige infraestructura
 * nueva (sin sesiones persistentes ni sockets, funciona detrás de cualquier balanceador de carga) y
 * autentica cada consulta con el mismo JWT. Se pausa con la pestaña oculta y se refresca al volver.
 *
 * El contador siempre es el valor absoluto del servidor (nunca se incrementa localmente), de modo que
 * una misma notificación no puede contarse dos veces.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private http = inject(HttpClient);
  private usuarioService = inject(UsuarioService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  /** Cantidad de notificaciones no leídas. */
  readonly noLeidas = signal(0);
  /** Últimas notificaciones para el panel de la campana. */
  readonly recientes = signal<NotificacionModel[]>([]);
  readonly cargando = signal(false);
  /** Se incrementa cada vez que llegan notificaciones nuevas (dispara la animación discreta). */
  readonly llegadas = signal(0);

  private temporizador: ReturnType<typeof setInterval> | undefined;
  private conocido = false;
  private consultando = false;
  private escuchandoVisibilidad = false;

  private get opciones() {
    return {
      headers: { 'x-token': this.usuarioService.token },
      context: new HttpContext().set(SKIP_LOADING, true),
    };
  }

  /** Comienza a sondear el contador. Es idempotente. */
  iniciarSondeo(intervalo: number = INTERVALO_SONDEO_MS): void {
    if (this.temporizador) return;
    void this.actualizarContador();
    this.temporizador = setInterval(() => {
      if (!document.hidden) void this.actualizarContador();
    }, intervalo);

    if (!this.escuchandoVisibilidad) {
      this.escuchandoVisibilidad = true;
      document.addEventListener('visibilitychange', this.alCambiarVisibilidad);
      this.destroyRef.onDestroy(() => this.detenerSondeo());
    }
  }

  detenerSondeo(): void {
    if (this.temporizador) clearInterval(this.temporizador);
    this.temporizador = undefined;
    document.removeEventListener('visibilitychange', this.alCambiarVisibilidad);
    this.escuchandoVisibilidad = false;
  }

  /** Limpia el estado al cerrar sesión. */
  reiniciar(): void {
    this.detenerSondeo();
    this.noLeidas.set(0);
    this.recientes.set([]);
    this.conocido = false;
  }

  private alCambiarVisibilidad = (): void => {
    if (!document.hidden && this.temporizador) void this.actualizarContador();
  };

  /** Consulta el contador; si subió respecto a lo conocido, avisa con `llegadas` y refresca el panel. */
  async actualizarContador(): Promise<void> {
    if (this.consultando) return;
    this.consultando = true;
    try {
      const { noLeidas } = await firstValueFrom(
        this.http.get<{ ok: boolean; noLeidas: number }>(`${url_api}/no-leidas`, this.opciones),
      );
      const anterior = this.noLeidas();
      this.noLeidas.set(noLeidas);
      if (this.conocido && noLeidas > anterior) {
        this.llegadas.update((n) => n + 1);
        void this.cargarRecientes();
      } else if (!this.conocido) {
        void this.cargarRecientes();
      }
      this.conocido = true;
    } catch {
      // Sin conexión o sesión vencida: no se muestra nada; el interceptor de sesión se ocupa de lo demás.
    } finally {
      this.consultando = false;
    }
  }

  async cargarRecientes(cantidad: number = 8): Promise<void> {
    try {
      const respuesta = await firstValueFrom(this.listar({ porPagina: cantidad }));
      this.recientes.set(respuesta.notificaciones);
      this.noLeidas.set(respuesta.noLeidas);
    } catch {
      // Se conserva lo que ya se mostraba.
    }
  }

  listar(filtro: FiltroNotificaciones = {}): Observable<ListaNotificaciones> {
    let params = new HttpParams();
    if (filtro.estado && filtro.estado !== 'todas') params = params.set('estado', filtro.estado);
    if (filtro.categoria) params = params.set('categoria', filtro.categoria);
    if (filtro.pagina) params = params.set('pagina', filtro.pagina);
    if (filtro.porPagina) params = params.set('porPagina', filtro.porPagina);
    return this.http.get<ListaNotificaciones>(url_api, { ...this.opciones, params });
  }

  /** Abre el elemento relacionado: la marca como leída y navega solo a rutas internas del sistema. */
  abrir(notificacion: NotificacionModel): boolean {
    if (!notificacion.leida) {
      this.marcarLeida(notificacion.id).subscribe({ error: () => undefined });
    }
    const url = urlDestinoSegura(notificacion.urlDestino);
    if (url) void this.router.navigateByUrl(url);
    return url !== null;
  }

  marcarLeida(id: number): Observable<{ ok: boolean; noLeidas: number }> {
    return this.http
      .patch<{ ok: boolean; noLeidas: number }>(`${url_api}/${id}/leida`, {}, this.opciones)
      .pipe(
        tap((r) => {
          this.noLeidas.set(r.noLeidas);
          this.recientes.update((lista) => lista.map((n) => (n.id === id ? { ...n, leida: true } : n)));
        }),
      );
  }

  marcarTodasLeidas(): Observable<{ ok: boolean; marcadas: number; noLeidas: number }> {
    return this.http
      .patch<{ ok: boolean; marcadas: number; noLeidas: number }>(`${url_api}/leidas`, {}, this.opciones)
      .pipe(
        tap((r) => {
          this.noLeidas.set(r.noLeidas);
          this.recientes.update((lista) => lista.map((n) => ({ ...n, leida: true })));
        }),
      );
  }

  eliminar(id: number): Observable<{ ok: boolean; noLeidas: number }> {
    return this.http.delete<{ ok: boolean; noLeidas: number }>(`${url_api}/${id}`, this.opciones).pipe(
      tap((r) => {
        this.noLeidas.set(r.noLeidas);
        this.recientes.update((lista) => lista.filter((n) => n.id !== id));
      }),
    );
  }
}
