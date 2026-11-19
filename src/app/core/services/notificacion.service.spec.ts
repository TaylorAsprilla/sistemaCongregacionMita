import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { NotificacionModel } from '../models/notificacion.model';
import { NotificacionService } from './notificacion.service';

const api = `${environment.base_url}/notificaciones`;

const notificacion = (extra: Partial<NotificacionModel> = {}): NotificacionModel => ({
  id: 1,
  tipo: 'INFORME_ENTREGADO',
  categoria: 'INFORMATIVA',
  titulo: 'Informe entregado',
  mensaje: 'Mensaje',
  entidadTipo: 'INFORME',
  entidadId: 10,
  urlDestino: '/sistema/ver-informe/10',
  leida: false,
  fechaLectura: null,
  fechaCreacion: '2026-11-18T15:00:00Z',
  ...extra,
});

const lista = (noLeidas: number, notificaciones: NotificacionModel[] = []) => ({
  ok: true,
  total: notificaciones.length,
  pagina: 1,
  porPagina: 8,
  totalPaginas: 1,
  noLeidas,
  notificaciones,
});

describe('NotificacionService', () => {
  let servicio: NotificacionService;
  let http: HttpTestingController;
  let navegar: jasmine.Spy;

  beforeEach(() => {
    navegar = jasmine.createSpy('navigateByUrl').and.resolveTo(true);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UsuarioService, useValue: { token: 'tkn' } },
        { provide: Router, useValue: { navigateByUrl: navegar } },
      ],
    });
    servicio = TestBed.inject(NotificacionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    servicio.detenerSondeo();
    http.verify();
  });

  const flushContador = (n: number) => http.expectOne(`${api}/no-leidas`).flush({ ok: true, noLeidas: n });
  const flushRecientes = (n: number, items: NotificacionModel[] = []) =>
    http.expectOne((r) => r.url === api && r.params.get('porPagina') === '8').flush(lista(n, items));

  it('autentica cada consulta con el token del usuario, sin disparar el spinner global', async () => {
    const pendiente = servicio.actualizarContador();
    const peticion = http.expectOne(`${api}/no-leidas`);
    expect(peticion.request.headers.get('x-token')).toBe('tkn');
    peticion.flush({ ok: true, noLeidas: 0 });
    await pendiente;
    flushRecientes(0);
  });

  it('el contador es siempre el valor del servidor: consultar dos veces lo mismo no lo incrementa', async () => {
    let pendiente = servicio.actualizarContador();
    flushContador(3);
    await pendiente;
    flushRecientes(3);
    expect(servicio.noLeidas()).toBe(3);
    expect(servicio.llegadas()).toBe(0, 'la carga inicial no cuenta como llegada');

    pendiente = servicio.actualizarContador();
    flushContador(3);
    await pendiente;
    expect(servicio.noLeidas()).toBe(3);
    expect(servicio.llegadas()).toBe(0);
  });

  it('avisa una sola vez cuando llegan nuevas y refresca el panel', async () => {
    let pendiente = servicio.actualizarContador();
    flushContador(1);
    await pendiente;
    flushRecientes(1);

    pendiente = servicio.actualizarContador();
    flushContador(3);
    await pendiente;
    expect(servicio.noLeidas()).toBe(3);
    expect(servicio.llegadas()).toBe(1);
    flushRecientes(3, [notificacion({ id: 2 }), notificacion({ id: 3 })]);
    await Promise.resolve();
    expect(servicio.recientes().length).toBe(2);

    // Si baja (porque las leyó en otra pestaña) no hay animación.
    pendiente = servicio.actualizarContador();
    flushContador(0);
    await pendiente;
    expect(servicio.llegadas()).toBe(1);
  });

  it('no lanza consultas simultáneas y tolera errores de red en silencio', async () => {
    const primera = servicio.actualizarContador();
    const segunda = servicio.actualizarContador(); // ignorada: ya hay una en curso
    http.expectOne(`${api}/no-leidas`).error(new ProgressEvent('error'));
    await Promise.all([primera, segunda]);
    expect(servicio.noLeidas()).toBe(0);
  });

  it('iniciarSondeo es idempotente', () => {
    servicio.iniciarSondeo(60_000);
    servicio.iniciarSondeo(60_000);
    http.expectOne(`${api}/no-leidas`).flush({ ok: true, noLeidas: 0 });
  });

  it('listar envía los filtros como parámetros', () => {
    servicio.listar({ estado: 'no-leidas', categoria: 'PENDIENTE', pagina: 2, porPagina: 15 }).subscribe();
    const peticion = http.expectOne((r) => r.url === api);
    expect(peticion.request.params.get('estado')).toBe('no-leidas');
    expect(peticion.request.params.get('categoria')).toBe('PENDIENTE');
    expect(peticion.request.params.get('pagina')).toBe('2');
    expect(peticion.request.params.get('porPagina')).toBe('15');
    peticion.flush(lista(0));
  });

  it('marcar como leída actualiza el contador y la lista local', () => {
    servicio.recientes.set([notificacion({ id: 1 }), notificacion({ id: 2 })]);
    servicio.marcarLeida(1).subscribe();
    const peticion = http.expectOne(`${api}/1/leida`);
    expect(peticion.request.method).toBe('PATCH');
    peticion.flush({ ok: true, noLeidas: 1 });
    expect(servicio.noLeidas()).toBe(1);
    expect(servicio.recientes().map((n) => n.leida)).toEqual([true, false]);
  });

  it('marcar todas deja todas leídas y el contador en cero', () => {
    servicio.recientes.set([notificacion({ id: 1 }), notificacion({ id: 2 })]);
    servicio.marcarTodasLeidas().subscribe();
    const peticion = http.expectOne(`${api}/leidas`);
    expect(peticion.request.method).toBe('PATCH');
    peticion.flush({ ok: true, marcadas: 2, noLeidas: 0 });
    expect(servicio.noLeidas()).toBe(0);
    expect(servicio.recientes().every((n) => n.leida)).toBeTrue();
  });

  it('eliminar la quita de la lista', () => {
    servicio.recientes.set([notificacion({ id: 1 }), notificacion({ id: 2 })]);
    servicio.eliminar(1).subscribe();
    const peticion = http.expectOne(`${api}/1`);
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush({ ok: true, noLeidas: 0 });
    expect(servicio.recientes().map((n) => n.id)).toEqual([2]);
  });

  it('abrir marca como leída y navega al elemento relacionado', () => {
    expect(servicio.abrir(notificacion({ id: 5 }))).toBeTrue();
    http.expectOne(`${api}/5/leida`).flush({ ok: true, noLeidas: 0 });
    expect(navegar).toHaveBeenCalledWith('/sistema/ver-informe/10');
  });

  it('abrir una ya leída no vuelve a llamar al servidor; un destino no seguro no navega', () => {
    expect(servicio.abrir(notificacion({ leida: true }))).toBeTrue();
    expect(navegar).toHaveBeenCalledTimes(1);

    navegar.calls.reset();
    expect(servicio.abrir(notificacion({ leida: true, urlDestino: 'https://malo.example' }))).toBeFalse();
    expect(servicio.abrir(notificacion({ leida: true, urlDestino: null }))).toBeFalse();
    expect(navegar).not.toHaveBeenCalled();
  });
});
