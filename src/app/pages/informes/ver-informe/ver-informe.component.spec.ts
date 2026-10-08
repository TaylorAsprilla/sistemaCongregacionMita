import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
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

describe('VerInformeComponent: cabecera del propietario', () => {
  let component: VerInformeComponent;
  let getUsuario: jasmine.Spy;
  const exomina = {
    primerNombre: 'Exomina',
    primerApellido: 'Rodriguez',
    segundoApellido: 'Mosquera',
    usuarioCongregacionPais: [{ pais: 'Colombia' }],
    usuarioCongregacionCongregacion: [{ congregacion: 'Buenaventura' }],
    usuarioCongregacionCampo: [{ campo: 'Centro' }],
  };

  beforeEach(() => {
    getUsuario = jasmine.createSpy('getUsuario').and.returnValue(of({ ok: true, usuario: exomina }));
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuarioId: 2182,
            usuarioNombre: 'Nevardo',
            usuario: {
              usuarioCongregacionPais: [{ pais: 'Colombia' }],
              usuarioCongregacionCongregacion: [{ congregacion: 'Cali' }],
            },
            getUsuario,
          },
        },
        { provide: ActivatedRoute, useValue: { params: of({ id: 55 }) } },
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: { state: { fromListaPais: true, informeData: { usuario_id: 2593 } } },
            }),
          },
        },
        ...[
          InformeService, ActividadService, ActividadEconomicaService, MetaService,
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

  it('muestra las congregaciones del obrero seleccionado, no las del supervisor', () => {
    component.ngOnInit();
    expect(getUsuario).toHaveBeenCalledOnceWith(2593);
    expect(component.nombreUsuario).toBe('Exomina Rodriguez Mosquera');
    expect(component.congregacionPais).toBe('Colombia');
    expect(component.congregacionCiudad).toBe('Buenaventura');
    expect(component.congregacionCampo).toBe('Centro');
  });

  it('limpia los datos anteriores mientras carga y usa N/A si no hay asignacion', () => {
    const respuesta = new Subject<{ ok: boolean; usuario: typeof exomina }>();
    getUsuario.and.returnValue(respuesta);
    component.congregacionCiudad = 'Cali';
    component.congregacionCampo = 'Anterior';
    component.ngOnInit();
    expect(component.nombreUsuario).toBe('');
    expect(component.congregacionCiudad).toBe('N/A');
    expect(component.congregacionCampo).toBe('N/A');
    respuesta.next({
      ok: true,
      usuario: { ...exomina, usuarioCongregacionCongregacion: [], usuarioCongregacionCampo: [] },
    });
    expect(component.congregacionCiudad).toBe('N/A');
    expect(component.congregacionCampo).toBe('N/A');
  });
});
