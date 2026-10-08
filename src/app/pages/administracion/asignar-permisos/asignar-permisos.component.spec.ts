import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PermisoService } from 'src/app/services/permiso/permiso.service';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { ResponsabilidadesObreroResponse } from 'src/app/core/interfaces/usuario.interface';
import AsignarPermisosComponent from './asignar-permisos.component';

describe('AsignarPermisosComponent: responsabilidades de obrero', () => {
  let component: AsignarPermisosComponent;
  let consultar: jasmine.Spy;
  const usuario = (id: number) => ({ id, usuarioPermiso: [] }) as UsuarioModel;
  const respuesta: ResponsabilidadesObreroResponse = {
    ok: true,
    responsabilidades: [
      { id: 2, nombre: 'Colombia', tipo: 'PAIS', rol: 'PRINCIPAL', activo: true },
      { id: 5, nombre: 'Buenaventura', tipo: 'CIUDAD', rol: 'SEGUNDO', activo: true },
      { id: 139, nombre: 'Centro', tipo: 'CAMPO', rol: 'PRINCIPAL', activo: false },
    ],
  };

  beforeEach(() => {
    consultar = jasmine.createSpy().and.returnValue(of(respuesta));
    TestBed.configureTestingModule({
      providers: [
        { provide: UsuarioService, useValue: { getResponsabilidadesObrero: consultar } },
        { provide: PermisoService, useValue: { getPermisos: () => of([]) } },
        { provide: Router, useValue: {} },
      ],
    });
    component = TestBed.runInInjectionContext(() => new AsignarPermisosComponent());
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('consulta responsabilidades incluso sin credenciales y conserva nivel, rol y estado', () => {
    component.buscarFeligres(usuario(2182));
    expect(consultar).toHaveBeenCalledOnceWith(2182);
    expect(component.responsabilidadesObrero).toEqual(respuesta.responsabilidades);
    expect(component.cargandoResponsabilidades).toBeFalse();
  });

  it('cancela la consulta anterior y no muestra datos del usuario anterior', () => {
    const anterior = new Subject<ResponsabilidadesObreroResponse>();
    const actual = new Subject<ResponsabilidadesObreroResponse>();
    consultar.and.returnValues(anterior, actual);
    component.buscarFeligres(usuario(2182));
    component.buscarFeligres(usuario(55));
    anterior.next(respuesta);
    expect(component.responsabilidadesObrero).toEqual([]);
    expect(component.cargandoResponsabilidades).toBeTrue();
    actual.next({ ok: true, responsabilidades: [] });
    expect(component.responsabilidadesObrero).toEqual([]);
    expect(component.cargandoResponsabilidades).toBeFalse();
    expect(component.errorResponsabilidades).toBe('');
  });

  it('muestra error de consulta y permite reintentar sin modificar permisos', () => {
    spyOn(console, 'error');
    consultar.and.returnValue(throwError(() => new Error('fallo de red')));
    component.buscarFeligres(usuario(2182));
    expect(component.errorResponsabilidades).not.toBe('');
    expect(component.cargandoResponsabilidades).toBeFalse();
    consultar.and.returnValue(of(respuesta));
    component.cargarResponsabilidadesObrero();
    expect(component.errorResponsabilidades).toBe('');
    expect(component.responsabilidadesObrero).toEqual(respuesta.responsabilidades);
  });

  it('cancela la consulta al destruir la pagina', () => {
    const pendiente = new Subject<ResponsabilidadesObreroResponse>();
    consultar.and.returnValue(pendiente);
    component.buscarFeligres(usuario(2182));
    component.ngOnDestroy();
    pendiente.next(respuesta);
    expect(component.responsabilidadesObrero).toEqual([]);
  });

  it('agrupa los nombres por nivel sin duplicar una unidad por sus dos roles', () => {
    component.buscarFeligres(usuario(2182));
    component.responsabilidadesObrero.push({
      id: 5, nombre: 'Buenaventura', tipo: 'CIUDAD', rol: 'PRINCIPAL', activo: true,
    });
    expect(component.congregacionesACargo('PAIS')).toBe('Colombia');
    expect(component.congregacionesACargo('CIUDAD')).toBe('Buenaventura');
    expect(component.congregacionesACargo('CAMPO')).toBe('Centro');
    component.responsabilidadesObrero = [];
    expect(component.congregacionesACargo('PAIS')).toBe('Sin asignación');
  });
});
