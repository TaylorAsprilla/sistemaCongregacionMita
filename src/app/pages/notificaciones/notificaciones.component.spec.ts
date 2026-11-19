import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListaNotificaciones, NotificacionModel } from 'src/app/core/models/notificacion.model';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { NotificacionesComponent } from './notificaciones.component';

const notificacion = (id: number, leida = false): NotificacionModel => ({
  id,
  tipo: 'SOLICITUD_NUEVA',
  categoria: 'SOLICITUD',
  titulo: `Solicitud ${id}`,
  mensaje: `Detalle ${id}`,
  entidadTipo: null,
  entidadId: null,
  urlDestino: '/sistema/solicitudes-multimedia',
  leida,
  fechaLectura: null,
  fechaCreacion: new Date().toISOString(),
});

const respuesta = (items: NotificacionModel[], extra: Partial<ListaNotificaciones> = {}): ListaNotificaciones => ({
  ok: true,
  total: items.length,
  pagina: 1,
  porPagina: 15,
  totalPaginas: 1,
  noLeidas: items.filter((n) => !n.leida).length,
  notificaciones: items,
  ...extra,
});

describe('NotificacionesComponent (Mis notificaciones)', () => {
  let fixture: ComponentFixture<NotificacionesComponent>;
  let servicio: {
    noLeidas: ReturnType<typeof signal<number>>;
    listar: jasmine.Spy;
    marcarLeida: jasmine.Spy;
    marcarTodasLeidas: jasmine.Spy;
    eliminar: jasmine.Spy;
    abrir: jasmine.Spy;
  };

  const host = () => fixture.nativeElement as HTMLElement;

  const crear = async (primera = respuesta([notificacion(1), notificacion(2, true)])) => {
    servicio = {
      noLeidas: signal(0),
      listar: jasmine.createSpy('listar').and.returnValue(of(primera)),
      marcarLeida: jasmine.createSpy('marcarLeida').and.returnValue(of({ ok: true, noLeidas: 0 })),
      marcarTodasLeidas: jasmine.createSpy('marcarTodasLeidas').and.returnValue(of({ ok: true, marcadas: 1, noLeidas: 0 })),
      eliminar: jasmine.createSpy('eliminar').and.returnValue(of({ ok: true, noLeidas: 0 })),
      abrir: jasmine.createSpy('abrir').and.returnValue(true),
    };
    await TestBed.configureTestingModule({
      imports: [NotificacionesComponent],
      providers: [{ provide: NotificacionService, useValue: servicio }],
    }).compileComponents();
    fixture = TestBed.createComponent(NotificacionesComponent);
    fixture.detectChanges();
  };

  it('carga y muestra el historial con su estado', async () => {
    await crear();
    expect(host().querySelector('h2')?.textContent).toContain('Mis notificaciones');
    expect(host().querySelectorAll('app-notificacion-item').length).toBe(2);
    expect(host().querySelector('.notificacion.no-leida')).not.toBeNull();
    expect(servicio.listar).toHaveBeenCalledWith({ estado: 'todas', categoria: '', pagina: 1, porPagina: 15 });
    expect(servicio.noLeidas()).toBe(1, 'actualiza el contador global con el del servidor');
  });

  it('los filtros por estado y categoría vuelven a consultar desde la página 1', async () => {
    await crear();
    servicio.listar.calls.reset();

    const botones = host().querySelectorAll<HTMLButtonElement>('.btn-group button');
    botones[1].click(); // No leídas
    expect(servicio.listar).toHaveBeenCalledWith(jasmine.objectContaining({ estado: 'no-leidas', pagina: 1 }));

    const select = host().querySelector('select') as HTMLSelectElement;
    select.value = 'PENDIENTE';
    select.dispatchEvent(new Event('change'));
    expect(servicio.listar).toHaveBeenCalledWith(jasmine.objectContaining({ estado: 'no-leidas', categoria: 'PENDIENTE', pagina: 1 }));
  });

  it('pagina el historial', async () => {
    await crear(respuesta([notificacion(1)], { total: 40, totalPaginas: 3 }));
    expect(host().querySelector('nav')).not.toBeNull();
    servicio.listar.calls.reset();

    const siguiente = Array.from(host().querySelectorAll<HTMLButtonElement>('nav button')).find((b) => b.textContent?.includes('Siguiente'))!;
    siguiente.click();
    expect(servicio.listar).toHaveBeenCalledWith(jasmine.objectContaining({ pagina: 2 }));

    const anterior = Array.from(host().querySelectorAll<HTMLButtonElement>('nav button')).find((b) => b.textContent?.includes('Anterior'))!;
    fixture.detectChanges();
    expect(anterior.disabled).toBeFalse();
  });

  it('sin resultados muestra un mensaje y con error ofrece reintentar', async () => {
    await crear(respuesta([]));
    expect(host().querySelector('.notificaciones-pagina__estado')?.textContent).toContain('No hay notificaciones');

    servicio.listar.and.returnValue(throwError(() => new Error('red')));
    fixture.componentInstance['cargar']();
    fixture.detectChanges();
    expect(host().textContent).toContain('No fue posible cargar');
    expect(host().querySelector('.notificaciones-pagina__estado button')).not.toBeNull();
  });

  it('abrir, marcar leída y eliminar delegan en el servicio', async () => {
    await crear();
    (host().querySelector('.notificacion__cuerpo') as HTMLElement).click();
    expect(servicio.abrir).toHaveBeenCalled();

    (host().querySelector('.btn-icono[title="Marcar como leída"]') as HTMLElement).click();
    expect(servicio.marcarLeida).toHaveBeenCalledWith(1);

    servicio.listar.calls.reset();
    (host().querySelector('.btn-icono--peligro') as HTMLElement).click();
    expect(servicio.eliminar).toHaveBeenCalled();
    expect(servicio.listar).toHaveBeenCalled();
  });

  it('marcar todas como leídas recarga el listado', async () => {
    await crear();
    servicio.noLeidas.set(1);
    fixture.detectChanges();
    servicio.listar.calls.reset();
    (host().querySelector('header button') as HTMLElement).click();
    expect(servicio.marcarTodasLeidas).toHaveBeenCalled();
    expect(servicio.listar).toHaveBeenCalled();
  });
});
