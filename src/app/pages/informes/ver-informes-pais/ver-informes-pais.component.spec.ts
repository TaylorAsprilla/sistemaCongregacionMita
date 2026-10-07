import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { obtenerPeriodoInforme } from 'src/app/core/utils/periodo-informe';
import { VerInformesPaisComponent } from './ver-informes-pais.component';

describe('VerInformesPaisComponent: consulta del supervisor', () => {
  let component: VerInformesPaisComponent;
  let informeService: InformeService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: InformeService, useValue: { estadoListaPais: null } },
        { provide: UsuarioService, useValue: { usuario: { id: 77 } } },
        { provide: PaisService, useValue: {} },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { data: of({ congregaciones: [], campos: [] }) } },
      ],
    });
    informeService = TestBed.inject(InformeService);
    component = TestBed.runInInjectionContext(() => new VerInformesPaisComponent());
    spyOn(component, 'cargarPaises');
  });

  it('abre Informes en el periodo activo', () => {
    component.ngOnInit();
    const periodo = obtenerPeriodoInforme();
    expect(component.vistaActiva).toBe('informes');
    expect(component.trimestre).toBe(periodo.trimestre);
    expect(component.anio).toBe(periodo.anio);
    expect(component.todosPeriodos).toBeFalse();
  });

  it('usa el periodo activo para los pendientes al consultar todo el historial', () => {
    spyOn(component, 'cargarInformes');
    component.trimestre = 1;
    component.anio = 2020;
    component.todosPeriodos = true;
    component.cambiarConsultaPeriodo();
    const periodo = obtenerPeriodoInforme();
    expect(component.trimestre).toBe(periodo.trimestre);
    expect(component.anio).toBe(periodo.anio);
    expect(component.cargarInformes).toHaveBeenCalled();
  });

  it('conserva filtros, orden y página antes de abrir el detalle', () => {
    component.paisId = 2;
    component.busqueda = 'Ana';
    component.paginaInformes = 3;
    component.congregacionSeleccionada = 5;
    component.ordenInformes = 'campo';
    component.verDetalleInforme(10);
    expect(informeService.estadoListaPais).toEqual(jasmine.objectContaining({
      usuarioId: 77, paisId: 2, busqueda: 'Ana', paginaInformes: 3,
      congregacionSeleccionada: 5, ordenInformes: 'campo',
    }));
    const restored = TestBed.runInInjectionContext(() => new VerInformesPaisComponent());
    spyOn(restored, 'cargarPaises');
    restored.ngOnInit();
    expect(restored.busqueda).toBe('Ana');
    expect(restored.congregacionSeleccionada).toBe(5);
    expect(restored.ordenInformes).toBe('campo');
    expect(informeService.estadoListaPais).toBeNull();
  });

  it('no restaura la búsqueda de otro usuario', () => {
    component.verDetalleInforme(10);
    if (!informeService.estadoListaPais) {
      fail('No se guardó el estado de la lista');
      return;
    }
    informeService.estadoListaPais.usuarioId = 99;
    informeService.estadoListaPais.busqueda = 'Otro usuario';
    component.ngOnInit();
    expect(component.busqueda).toBe('');
  });

  it('busca pendientes por responsable y respeta la congregación seleccionada', () => {
    component.pendientes = [{
      id: 4, nombre: 'Centro', tipo: 'CAMPO', congregacion_id: 2, campo_id: 4,
      responsables: [{
        id: 77, primerNombre: 'Ana', segundoNombre: '', primerApellido: 'Pérez',
        segundoApellido: '', numeroCelular: '123456',
      }],
    }];
    component.busqueda = 'ana';
    component.aplicarFiltros();
    expect(component.pendientesFiltrados.length).toBe(1);
    component.congregacionSeleccionada = 3;
    component.aplicarFiltros();
    expect(component.pendientesFiltrados.length).toBe(0);
  });
});
