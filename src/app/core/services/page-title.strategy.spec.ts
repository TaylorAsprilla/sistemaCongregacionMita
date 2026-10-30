import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { environment } from 'environment';
import authRoutes from '../../auth/auth.routes';
import { childRoutes } from '../../routes/child-routes/child.routes';
import multimediaRoutes from '../../pages/multimedia/multimedia.routes';
import { PageTitleStrategy } from './page-title.strategy';

@Component({ standalone: true, template: '' })
class PaginaPruebaComponent {}

describe('PageTitleStrategy', () => {
  const prefijo = () => environment.production ? '' : 'PRUEBAS · ';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          ...authRoutes.map(route => ({ ...route, component: PaginaPruebaComponent })),
          { path: 'sistema', title: 'Inicio', children: [
            { path: 'historial', component: PaginaPruebaComponent, title: 'Historial de accesos QR' },
          ] },
          { path: 'sin-titulo', component: PaginaPruebaComponent },
          { path: '**', component: PaginaPruebaComponent, title: 'Página no encontrada' },
        ]),
        { provide: TitleStrategy, useClass: PageTitleStrategy },
      ],
    });
  });

  it('distingue login normal y QR incluso cambiando solo los parametros', async () => {
    const harness = await RouterTestingHarness.create('/login');
    const titulo = TestBed.inject(Title);
    expect(titulo.getTitle()).toBe(`${prefijo()}Iniciar sesión | CMAR LIVE`);
    await harness.navigateByUrl('/login?ticket=prueba');
    expect(titulo.getTitle()).toBe(`${prefijo()}Acceso QR | CMAR LIVE`);
    await harness.navigateByUrl('/login');
    expect(titulo.getTitle()).toBe(`${prefijo()}Iniciar sesión | CMAR LIVE`);
  });

  it('identifica recuperacion y cambio de contraseña sin exponer el token', async () => {
    const harness = await RouterTestingHarness.create('/recuperar-cuenta');
    const titulo = TestBed.inject(Title);
    expect(titulo.getTitle()).toBe(`${prefijo()}Recuperar cuenta | CMAR LIVE`);
    await harness.navigateByUrl('/nueva-contrasena/token-prueba');
    expect(titulo.getTitle()).toBe(`${prefijo()}Crear nueva contraseña | CMAR LIVE`);
  });

  it('usa el titulo de la pagina hija en rutas anidadas', async () => {
    await RouterTestingHarness.create('/sistema/historial');
    expect(TestBed.inject(Title).getTitle()).toBe(`${prefijo()}Historial de accesos QR | CMAR LIVE`);
  });

  it('restablece un titulo base cuando no hay titulo y distingue paginas inexistentes', async () => {
    const harness = await RouterTestingHarness.create('/login');
    await harness.navigateByUrl('/sin-titulo');
    expect(TestBed.inject(Title).getTitle()).toBe(`${prefijo()}CMAR LIVE`);
    await harness.navigateByUrl('/no-existe');
    expect(TestBed.inject(Title).getTitle()).toBe(`${prefijo()}Página no encontrada | CMAR LIVE`);
  });

  it('cubre todas las paginas privadas y publicas con titulos explicitos', () => {
    for (const route of [...childRoutes, ...authRoutes, ...multimediaRoutes]) {
      expect(route.title).withContext(`Ruta sin titulo: ${route.path}`).toBeDefined();
    }
  });
});
