import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ROLES, RUTAS } from 'src/app/routes/menu-items';
import { HeaderComponent } from './header.component';
import { FotoPerfilDialogoService } from 'src/app/core/services/foto-perfil-dialogo.service';

describe('HeaderComponent enlaces de usuario', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let usuario: Partial<UsuarioModel>;
  const logout = jasmine.createSpy('logout');

  beforeEach(async () => {
    usuario = { id: 7, primerNombre: 'Prueba', usuarioPermiso: [] };
    logout.calls.reset();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UsuarioService, useValue: { usuario, isQRLogin: false, logout } },
      ],
    }).compileComponents();
  });

  function renderizar() {
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  }

  function enlace(texto: string): HTMLAnchorElement | undefined {
    return Array.from(fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>)
      .find(a => a.textContent?.trim() === texto);
  }

  it('enlaza perfil y contraseña con destinos absolutos y elimina configuracion', () => {
    renderizar();
    expect(enlace('Perfil')?.getAttribute('href')).toBe(`/sistema/${RUTAS.PERFIL}/7`);
    expect(enlace('Cambiar Contraseña')?.getAttribute('href')).toBe(`/sistema/${RUTAS.RESET_PASSWORD_USUARIO}`);
    expect(enlace('Configuración')).toBeUndefined();
  });

  it('muestra Mis informes a los dos roles autorizados', () => {
    for (const permiso of [ROLES.OBRERO_CIUDAD, ROLES.OBRERO_CAMPO]) {
      usuario.usuarioPermiso = [{ id: 1, permiso }];
      renderizar();
      expect(enlace('Mis informes')?.getAttribute('href')).toBe(`/sistema/${RUTAS.MIS_INFORMES}`);
      fixture.destroy();
    }
  });

  it('no ofrece Mis informes a roles que la ruta no admite', () => {
    usuario.usuarioPermiso = [{ id: 1, permiso: ROLES.ADMINISTRADOR }];
    renderizar();
    expect(enlace('Mis informes')).toBeUndefined();
  });

  it('al hacer clic en la foto abre el selector sin navegar al perfil', () => {
    const abrirSelector = jasmine.createSpy('abrirSelector').and.returnValue(true);
    TestBed.overrideProvider(FotoPerfilDialogoService, { useValue: { abrirSelector } });
    renderizar();
    const boton = fixture.nativeElement.querySelector('button.avatar-cambiar') as HTMLButtonElement;
    expect(boton).not.toBeNull();
    expect(boton.closest('a')).toBeNull();
    boton.click();
    expect(abrirSelector).toHaveBeenCalledTimes(1);
  });

  it('Cerrar sesion ejecuta el cierre existente', () => {
    renderizar();
    enlace('Cerrar Sesión')?.click();
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
