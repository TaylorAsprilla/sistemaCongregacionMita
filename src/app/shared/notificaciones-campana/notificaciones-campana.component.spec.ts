import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NotificacionModel } from 'src/app/core/models/notificacion.model';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { NotificacionesCampanaComponent } from './notificaciones-campana.component';

const notificacion = (id: number, leida = false, extra: Partial<NotificacionModel> = {}): NotificacionModel => ({
  id,
  tipo: 'INFORME_PENDIENTE',
  categoria: 'PENDIENTE',
  titulo: `Aviso ${id}`,
  mensaje: `Mensaje ${id}`,
  entidadTipo: null,
  entidadId: null,
  urlDestino: '/sistema/informe',
  leida,
  fechaLectura: null,
  fechaCreacion: new Date().toISOString(),
  ...extra,
});

describe('NotificacionesCampanaComponent', () => {
  let fixture: ComponentFixture<NotificacionesCampanaComponent>;
  let servicio: {
    noLeidas: ReturnType<typeof signal<number>>;
    recientes: ReturnType<typeof signal<NotificacionModel[]>>;
    llegadas: ReturnType<typeof signal<number>>;
    iniciarSondeo: jasmine.Spy;
    detenerSondeo: jasmine.Spy;
    cargarRecientes: jasmine.Spy;
    marcarLeida: jasmine.Spy;
    marcarTodasLeidas: jasmine.Spy;
    abrir: jasmine.Spy;
  };

  const host = () => fixture.nativeElement as HTMLElement;
  const contador = () => host().querySelector('.campana-contador');

  beforeEach(async () => {
    servicio = {
      noLeidas: signal(0),
      recientes: signal<NotificacionModel[]>([]),
      llegadas: signal(0),
      iniciarSondeo: jasmine.createSpy('iniciarSondeo'),
      detenerSondeo: jasmine.createSpy('detenerSondeo'),
      cargarRecientes: jasmine.createSpy('cargarRecientes').and.resolveTo(),
      marcarLeida: jasmine.createSpy('marcarLeida').and.returnValue(of({ ok: true, noLeidas: 0 })),
      marcarTodasLeidas: jasmine.createSpy('marcarTodasLeidas').and.returnValue(of({ ok: true, marcadas: 2, noLeidas: 0 })),
      abrir: jasmine.createSpy('abrir').and.returnValue(true),
    };
    await TestBed.configureTestingModule({
      imports: [NotificacionesCampanaComponent],
      providers: [provideRouter([]), { provide: NotificacionService, useValue: servicio }],
    }).compileComponents();
    fixture = TestBed.createComponent(NotificacionesCampanaComponent);
    fixture.detectChanges();
  });

  it('inicia el sondeo al mostrarse y lo detiene al destruirse', () => {
    expect(servicio.iniciarSondeo).toHaveBeenCalledTimes(1);
    fixture.destroy();
    expect(servicio.detenerSondeo).toHaveBeenCalled();
  });

  it('sin pendientes muestra la campana sin contador', () => {
    expect(host().querySelector('.fa-bell')).not.toBeNull();
    expect(contador()).toBeNull();
    expect(host().querySelector('a')?.getAttribute('aria-label')).toContain('no hay pendientes');
  });

  it('con pendientes muestra el contador (99+ como máximo) y lo expone a lectores de pantalla', () => {
    servicio.noLeidas.set(4);
    fixture.detectChanges();
    expect(contador()?.textContent?.trim()).toBe('4');
    expect(host().querySelector('a')?.getAttribute('aria-label')).toContain('4 sin leer');

    servicio.noLeidas.set(250);
    fixture.detectChanges();
    expect(contador()?.textContent?.trim()).toBe('99+');
  });

  it('al abrir el panel carga las notificaciones recientes', () => {
    (host().querySelector('a[role="button"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(servicio.cargarRecientes).toHaveBeenCalled();
    expect(host().querySelector('.panel-notificaciones')).not.toBeNull();
  });

  it('lista título, mensaje y estado; las pestañas filtran leídas y no leídas', () => {
    servicio.recientes.set([notificacion(1, false), notificacion(2, true)]);
    (host().querySelector('a[role="button"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(host().querySelectorAll('app-notificacion-item').length).toBe(2);
    expect(host().querySelector('.notificacion__titulo')?.textContent).toContain('Aviso 1');
    expect(host().querySelector('.notificacion.no-leida')).not.toBeNull();
    expect(host().querySelector('.notificacion.leida')).not.toBeNull();

    const pestanas = host().querySelectorAll<HTMLButtonElement>('.panel__pestanas button');
    pestanas[1].click(); // No leídas
    fixture.detectChanges();
    expect(host().querySelectorAll('app-notificacion-item').length).toBe(1);
    expect(host().querySelector('.notificacion__titulo')?.textContent).toContain('Aviso 1');

    pestanas[2].click(); // Leídas
    fixture.detectChanges();
    expect(host().querySelectorAll('app-notificacion-item').length).toBe(1);
    expect(host().querySelector('.notificacion__titulo')?.textContent).toContain('Aviso 2');
  });

  it('muestra un mensaje cuando no hay notificaciones', () => {
    (host().querySelector('a[role="button"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(host().querySelector('.panel__vacio')?.textContent).toContain('No tiene notificaciones');
  });

  it('abrir una notificación delega en el servicio (marca leída y navega)', () => {
    const una = notificacion(1);
    servicio.recientes.set([una]);
    (host().querySelector('a[role="button"]') as HTMLElement).click();
    fixture.detectChanges();
    (host().querySelector('.notificacion__cuerpo') as HTMLElement).click();
    expect(servicio.abrir).toHaveBeenCalledWith(una);
  });

  it('marcar una como leída y marcar todas', () => {
    servicio.noLeidas.set(2);
    servicio.recientes.set([notificacion(1), notificacion(2)]);
    (host().querySelector('a[role="button"]') as HTMLElement).click();
    fixture.detectChanges();

    (host().querySelector('.btn-icono') as HTMLElement).click();
    expect(servicio.marcarLeida).toHaveBeenCalledWith(1);

    (host().querySelector('.panel__marcar-todas') as HTMLElement).click();
    expect(servicio.marcarTodasLeidas).toHaveBeenCalled();
  });

  it('"marcar todas" queda deshabilitado sin pendientes', () => {
    (host().querySelector('a[role="button"]') as HTMLElement).click();
    fixture.detectChanges();
    expect((host().querySelector('.panel__marcar-todas') as HTMLButtonElement).disabled).toBeTrue();
  });

  it('anima la campana solo cuando llegan notificaciones nuevas', () => {
    expect(host().querySelector('.campana-animada')).toBeNull();
    servicio.llegadas.set(1);
    fixture.detectChanges();
    expect(host().querySelector('.campana-animada')).not.toBeNull();
  });
});
