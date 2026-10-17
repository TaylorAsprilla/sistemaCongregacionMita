import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { ActividadEconomicaService } from 'src/app/services/actividad-economica/actividad-economica.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import { VisitaService } from 'src/app/services/visita/visita.service';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';
import { LogroService } from 'src/app/services/logro/logro.service';
import { DiezmoService } from 'src/app/services/diezmo/diezmo.service';
import { AspectoEspiritualService } from 'src/app/services/aspecto-espiritual/aspecto-espiritual.service';
import { AsuntoPendienteService } from 'src/app/services/asunto-pendiente/asunto-pendiente.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { TipoActividadEconomicaService } from 'src/app/services/tipo-actividad-economica/tipo-actividad-economica.service';
import { VerInformeComponent } from './ver-informe.component';
import { RUTAS } from 'src/app/routes/menu-items';
import pdfMake from 'pdfmake/build/pdfmake';
import Swal from 'sweetalert2';

describe('VerInformeComponent: snapshot histórico', () => {
  let component: VerInformeComponent;
  let getUsuario: jasmine.Spy;
  let getInforme: jasmine.Spy;
  let getMisResponsabilidades: jasmine.Spy;
  let route: {
    params: Observable<Record<string, number>>;
    snapshot: { queryParamMap: { get: (nombre: string) => string | null } };
  };
  const informeData = {
    usuario_id: 2593,
    periodo: '2026-07-01',
    responsables: [
      {
        usuario_id: 2593,
        nombre_responsable: 'Exomina Rodriguez Mosquera',
        tipo_responsabilidad: 'PRINCIPAL',
      },
      {
        usuario_id: 2182,
        nombre_responsable: 'Nevardo Pérez',
        tipo_responsabilidad: 'AUXILIAR',
      },
    ],
    unidad: {
      nombre_pais: 'Colombia',
      nombre_congregacion: 'Buenaventura',
      nombre_campo: 'Centro',
    },
  };

  beforeEach(() => {
    getUsuario = jasmine.createSpy('getUsuario').and.returnValue(of({ ok: true, usuario: {} }));
    getInforme = jasmine.createSpy('getInforme').and.returnValue(of({ informacioninforme: informeData }));
    getMisResponsabilidades = jasmine.createSpy('getMisResponsabilidades').and.returnValue(of({
      ambitos: [
        { tipo_congregacion: 'PAIS', nombre_unidad: 'Chile', informe: { id: 60, estado: 'Abierto' } },
        { tipo_congregacion: 'CONGREGACION', nombre_unidad: 'Salinas', nombre_pais: 'Puerto Rico', informe: { id: 61, estado: 'Abierto' } },
        { tipo_congregacion: 'CAMPO', nombre_unidad: 'Centro', informe: null },
      ],
      legados: [],
    }));
    route = {
      params: of({ id: 55 }),
      snapshot: { queryParamMap: { get: () => null } },
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuarioId: 2182,
            usuarioNombre: 'Nevardo',
            usuario: {
              id: 2182,
              usuarioCongregacionPais: [{ pais: 'Colombia' }],
              usuarioCongregacionCongregacion: [{ congregacion: 'Cali' }],
            },
            getUsuario,
          },
        },
        { provide: ActivatedRoute, useValue: route },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
            getCurrentNavigation: () => ({
              extras: { state: { fromListaPais: true, informeData } },
            }),
          },
        },
        { provide: InformeService, useValue: { getInforme, getMisResponsabilidades, informeActivoId: 61 } },
        ...[
          ActividadService, ActividadEconomicaService, MetaService,
          VisitaService, SituacionVisitaService, LogroService, DiezmoService,
          AspectoEspiritualService, AsuntoPendienteService,
        ].map((provide) => ({ provide, useValue: {} })),
        { provide: TipoActividadService, useValue: { getTipoActividad: () => of([]) } },
        {
          provide: TipoActividadEconomicaService,
          useValue: { getTipoActividadEconomica: () => of([]) },
        },
      ],
    });
    component = TestBed.runInInjectionContext(() => new VerInformeComponent());
    spyOn(component, 'cargarDatosInforme' as never);
  });

  it('muestra todos los responsables y la jerarquía guardados en el informe', () => {
    component.ngOnInit();
    expect(getUsuario).not.toHaveBeenCalled();
    expect(component.nombreUsuario).toBe('Exomina Rodriguez Mosquera');
    expect(component.congregacionPais).toBe('Colombia');
    expect(component.congregacionCiudad).toBe('Buenaventura');
    expect(component.congregacionCampo).toBe('Centro');
    expect(component.responsablesInforme).toEqual(informeData.responsables);
  });

  it('no reconstruye asignaciones históricas cuando el informe legado no tiene snapshot', () => {
    getInforme.and.returnValue(of({ informacioninforme: { usuario_id: 2593 } }));
    component.ngOnInit();
    expect(getInforme).toHaveBeenCalledWith(55);
    expect(getUsuario).not.toHaveBeenCalled();
    expect(component.responsablesInforme).toEqual([]);
    expect(component.nombreUsuario).toBe('Información histórica no disponible');
    expect(component.congregacionCiudad).toBe('Información histórica no disponible');
  });

  it('ofrece los informes abiertos y consulta el seleccionado previamente al entrar sin ID', () => {
    route.params = of({});
    component.ngOnInit();
    expect(getMisResponsabilidades).toHaveBeenCalled();
    expect(component.informesDisponibles.map((informe) => informe.id)).toEqual([60, 61]);
    expect(component.informeConsultaId).toBe(61);
    expect(getInforme).toHaveBeenCalledWith(61);
  });

  it('cambia la consulta por ID sin modificar el informe activo de diligenciamiento', () => {
    route.params = of({});
    component.ngOnInit();
    component.cargando = false;
    component.seleccionarInformeConsulta('60');
    expect(getInforme).toHaveBeenCalledWith(60);
    expect(component.informeConsultaId).toBe(60);
    expect(TestBed.inject(InformeService).informeActivoId).toBe(61);
  });

  it('incluye todos los responsables en el encabezado PDF sin cargos ni viñetas', () => {
    component.ngOnInit();
    expect(component.obtenerNombresResponsables()).toEqual([
      'Exomina Rodriguez Mosquera',
      'Nevardo Pérez',
    ]);
  });

  it('genera el PDF con los dos nombres y mensajes de secciones vacías, sin roles', () => {
    component.ngOnInit();
    const descargar = jasmine.createSpy('download');
    const crearPdf = spyOn(pdfMake, 'createPdf').and.returnValue({ download: descargar });
    spyOn(Swal, 'fire');
    component.descargarPDF();
    const documento = JSON.stringify(crearPdf.calls.mostRecent().args[0]);
    expect(documento).toContain('Exomina Rodriguez Mosquera');
    expect(documento).toContain('Nevardo Pérez');
    expect(documento).toContain('Responsables:');
    expect(documento).toContain('No hay visitas registradas.');
    expect(documento).not.toContain('Sin novedades en este trimestre');
    expect(documento).not.toContain('PRINCIPAL');
    expect(documento).not.toContain('AUXILIAR');
    expect(descargar).toHaveBeenCalled();
  });

  it('mantiene la indicación histórica si el informe no guarda responsables', () => {
    getInforme.and.returnValue(of({ informacioninforme: { usuario_id: 2593 } }));
    component.ngOnInit();
    expect(component.obtenerNombresResponsables()).toEqual(['Información histórica no disponible']);
  });

  it('vuelve a diligenciamiento cuando la consulta se abrió desde el informe activo', () => {
    route.snapshot.queryParamMap.get = () => RUTAS.INFORME;
    component.ngOnInit();
    component.volverAlInforme();
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith(
      `${RUTAS.SISTEMA}/${RUTAS.INFORME}`,
    );
  });

});
