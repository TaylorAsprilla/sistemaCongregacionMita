import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ROLES } from 'src/app/routes/menu-items';
import { RolUsuarioComponent } from './rol-usuario.component';

describe('RolUsuarioComponent', () => {
  let fixture: ComponentFixture<RolUsuarioComponent>;

  const prioridad = [
    [ROLES.ADMINISTRADOR, 'Administrador'],
    [ROLES.ADMINISTRADOR_PAIS, 'Administrador país'],
    [ROLES.SUPERVISOR, 'Supervisor'],
    [ROLES.SUPERVISOR_LOCAL, 'Supervisor local'],
    [ROLES.OBRERO_PAIS, 'Obrero país'],
    [ROLES.OBRERO_CIUDAD, 'Obrero ciudad'],
    [ROLES.OBRERO_CAMPO, 'Obrero campo'],
    [ROLES.ASISTENTE_OOTS, 'Asistente OOTS'],
    [ROLES.APROBADOR_MULTIMEDIA, 'Aprobador multimedia'],
    [ROLES.ADMINISTRADOR_MULTIMEDIA, 'Administrador multimedia'],
    [ROLES.COMITE_RECTOR, 'Comité rector'],
    [ROLES.AYUDANTE, 'Ayudante'],
    [ROLES.MULTIMEDIA, 'Multimedia'],
    [ROLES.USUARIO, 'Usuario'],
    [ROLES.PRUEBA_INFORMES, 'Prueba informes'],
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RolUsuarioComponent] }).compileComponents();
    fixture = TestBed.createComponent(RolUsuarioComponent);
  });

  prioridad.forEach(([rol, etiqueta], indice) => {
    it(`muestra solo ${etiqueta} frente a todos los roles de menor prioridad`, () => {
      const permisos = prioridad.slice(indice).reverse().map(([permiso]) => ({ permiso }));
      const antes = JSON.stringify(permisos);
      fixture.componentRef.setInput('permisos', permisos);
      fixture.detectChanges();

      const elemento: HTMLElement = fixture.nativeElement;
      expect(fixture.componentInstance.rolPrincipal).toBe(etiqueta);
      expect(elemento.querySelectorAll('.rol-usuario').length).toBe(1);
      expect(elemento.querySelector('.rol-usuario')?.textContent?.trim()).toBe(etiqueta);
      expect(elemento.querySelector('.rol-usuario')?.getAttribute('aria-label')).toBe(`Rol principal: ${etiqueta}`);
      expect(JSON.stringify(permisos)).toBe(antes);
      expect(permisos.some(({ permiso }) => permiso === rol)).toBeTrue();
    });
  });

  it('normaliza mayusculas, espacios y acentos sin confundir roles con prefijos compartidos', () => {
    fixture.componentRef.setInput('permisos', [
      { permiso: ' administrador multimedia ' },
      { permiso: 'administrador pais' },
      { permiso: 'USUARIO' },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance.rolPrincipal).toBe('Administrador país');
  });

  it('oculta la insignia si no hay permisos o si no hay un rol reconocido', () => {
    for (const permisos of [undefined, null, [], [{ permiso: 'OTRO ROL' }]]) {
      fixture.componentRef.setInput('permisos', permisos);
      fixture.detectChanges();
      const elemento: HTMLElement = fixture.nativeElement;
      expect(elemento.querySelector('.rol-usuario')).toBeNull();
    }
  });

  it('actualiza la insignia al cambiar los permisos y no duplica roles', () => {
    fixture.componentRef.setInput('permisos', [{ permiso: ROLES.USUARIO }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.rolPrincipal).toBe('Usuario');

    fixture.componentRef.setInput('permisos', [
      { permiso: ROLES.ADMINISTRADOR },
      { permiso: ROLES.ADMINISTRADOR },
      { permiso: ROLES.USUARIO },
    ]);
    fixture.detectChanges();
    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.querySelectorAll('.rol-usuario').length).toBe(1);
    expect(fixture.componentInstance.rolPrincipal).toBe('Administrador');
  });
});
