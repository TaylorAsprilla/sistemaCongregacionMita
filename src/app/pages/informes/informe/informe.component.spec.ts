import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AmbitoInformeInterface } from 'src/app/core/interfaces/informe.interface';
import { RUTAS } from 'src/app/routes/menu-items';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { InformeComponent } from './informe.component';

describe('InformeComponent', () => {
  let component: InformeComponent;
  let fixture: ComponentFixture<InformeComponent>;
  let informeServiceMock: {
    informeActivo: any;
    informeActivoId: number | null;
    getMisResponsabilidades: jasmine.Spy;
    cargarResumenInforme: jasmine.Spy;
    limpiarInformeActivo: jasmine.Spy;
    obtenerResumenInforme: jasmine.Spy;
    cerrarInforme: jasmine.Spy;
    getAuditoria: jasmine.Spy;
  };

  beforeEach(async () => {
    informeServiceMock = {
      informeActivo: null,
      informeActivoId: null,
      getMisResponsabilidades: jasmine.createSpy().and.returnValue(
        of({ ambitos: [], legados: [] }),
      ),
      cargarResumenInforme: jasmine
        .createSpy()
        .and.returnValue(of({ tieneInformeAbierto: false, secciones: null })),
      limpiarInformeActivo: jasmine.createSpy(),
      obtenerResumenInforme: jasmine.createSpy(),
      cerrarInforme: jasmine.createSpy().and.returnValue(of({ ok: true })),
      getAuditoria: jasmine.createSpy().and.returnValue(of({ registros: [] })),
    };
    await TestBed.configureTestingModule({
      imports: [InformeComponent],
      providers: [
        provideRouter([]),
        { provide: UsuarioService, useValue: { usuarioId: 1 } },
        { provide: InformeService, useValue: informeServiceMock },
      ],
    }).compileComponents();
    spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function ambito(id: number): AmbitoInformeInterface {
    return {
      tipo_congregacion: 'CONGREGACION', congregacion_id: id,
      nombre_unidad: `Ciudad ${id}`, nombre_pais: 'Colombia',
      nombre_congregacion: `Ciudad ${id}`, nombre_campo: null, responsables: [],
      informe: { id, usuario_id: 1, estado: 'Abierto', periodo: '2026-07-01', createdAt: '', updatedAt: '' },
    };
  }

  it('muestra las secciones sin historial ni controles de revisión', () => {
    informeServiceMock.cargarResumenInforme.and.returnValue(of({
      tieneInformeAbierto: true, secciones: { metas: true },
    }));
    component.ambitos = [ambito(20)];
    component.seleccionarInforme(ambito(20));
    fixture.detectChanges();
    const pantalla: HTMLElement = fixture.nativeElement;
    expect(pantalla.querySelector('app-seccion-informe')).not.toBeNull();
    expect(pantalla.textContent).not.toContain('Ver historial de cambios');
    expect(pantalla.textContent).not.toContain('Ocultar historial de cambios');
    expect(pantalla.querySelector('[aria-label="Historial de cambios"]')).toBeNull();
    expect(informeServiceMock.getAuditoria).not.toHaveBeenCalled();
    expect(pantalla.textContent).not.toContain('Marcar revisada');
    expect(pantalla.textContent).not.toContain('Sin novedades');
    expect(pantalla.textContent).not.toContain('Sin revisar');
  });

  it('cancela el resumen anterior al cambiar rápidamente de Congregación', () => {
    const anterior = new Subject<any>();
    const actual = new Subject<any>();
    informeServiceMock.cargarResumenInforme.and.returnValues(anterior, actual);
    component.seleccionarInforme(ambito(20));
    component.seleccionarInforme(ambito(21));
    actual.next({ tieneInformeAbierto: true, secciones: { metas: true } });
    anterior.next({ tieneInformeAbierto: false, secciones: null });
    expect(component.ambitoSeleccionado?.informe?.id).toBe(21);
    expect(component.hayInformeAbierto).toBeTrue();
    expect(informeServiceMock.informeActivo.id).toBe(21);
    expect(informeServiceMock.informeActivo.nombre_unidad).toBe('Ciudad 21');
  });

  it('conserva el origen Informe para volver desde la vista completa', () => {
    component.verInforme(20);
    expect(TestBed.inject(Router).navigateByUrl).toHaveBeenCalledWith(
      `${RUTAS.SISTEMA}/${RUTAS.VER_INFORME}/20?origen=${RUTAS.INFORME}`,
    );
  });

  it('permite cerrar el informe sin exigir marcas de revisión', async () => {
    component.ambitoSeleccionado = ambito(20);
    informeServiceMock.informeActivoId = 20;
    informeServiceMock.obtenerResumenInforme.and.returnValue(of({}));
    const confirmar = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    component.cerrarInforme();
    await Promise.resolve();
    const texto = (confirmar.calls.first().args[0] as any).html;
    expect(texto).not.toContain('Pendientes de revisión');
    expect(texto).not.toContain('Sin novedades');
    expect(informeServiceMock.cerrarInforme).toHaveBeenCalledWith(20);
  });

  it('resume Congregación, período, responsables y grupos de secciones antes de cerrar', () => {
    component.ambitoSeleccionado = ambito(20);
    component.ambitoSeleccionado.responsables = [{
      usuario_id: 1, nombre_responsable: 'Ana Pérez', tipo_responsabilidad: 'PRINCIPAL',
    }];
    informeServiceMock.informeActivoId = 20;
    informeServiceMock.obtenerResumenInforme.and.returnValue(of({
      secciones: { metas: true },
    }));
    const confirmar = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    component.cerrarInforme();
    const texto = (confirmar.calls.first().args[0] as any).html;
    expect(texto).toContain('Congregación Ciudad');
    expect(texto).toContain('Ciudad 20');
    expect(texto).toContain('Período: 3er trimestre de 2026');
    expect(texto).toContain('Responsables: Ana Pérez');
    expect(texto).not.toContain('Obrero principal');
    expect(texto).not.toContain('Obrero auxiliar');
    expect(texto).toContain('Con datos: Metas');
    expect(texto).not.toContain('Sin novedades:');
    expect(texto).not.toContain('Pendientes de revisión:');
    expect(informeServiceMock.cerrarInforme).not.toHaveBeenCalled();
  });

  it('cancela el resumen pendiente al destruir la pantalla', () => {
    const respuesta = new Subject<any>();
    informeServiceMock.cargarResumenInforme.and.returnValue(respuesta);
    component.seleccionarInforme(ambito(20));
    fixture.destroy();
    respuesta.next({ tieneInformeAbierto: true, secciones: null });
    expect(component.hayInformeAbierto).toBeFalse();
  });

  it('presenta ámbitos independientes aunque pertenezcan al mismo usuario', () => {
    informeServiceMock.getMisResponsabilidades.and.returnValue(
      of({
        ambitos: [
          {
            tipo_congregacion: 'CONGREGACION',
            congregacion_id: 5,
            nombre_unidad: 'Tuluá',
            nombre_pais: 'Colombia',
            nombre_congregacion: 'Tuluá',
            nombre_campo: null,
            responsables: [],
            informe: {
              id: 20,
              usuario_id: 1,
              estado: 'Abierto',
              periodo: '2026-07-01',
              createdAt: '',
              updatedAt: '',
            },
          },
          {
            tipo_congregacion: 'PAIS',
            congregacion_id: 8,
            nombre_unidad: 'Chile',
            nombre_pais: 'Chile',
            nombre_congregacion: null,
            nombre_campo: null,
            responsables: [],
            informe: {
              id: 21,
              usuario_id: 1,
              estado: 'Abierto',
              periodo: '2026-07-01',
              createdAt: '',
              updatedAt: '',
            },
          },
        ],
        legados: [],
      }),
    );
    component.verificarInformeAbierto();

    expect(component.ambitos.map((ambito) => ambito.nombre_unidad)).toEqual([
      'Tuluá',
      'Chile',
    ]);
    expect(component.ambitos[0].informe?.id).not.toBe(
      component.ambitos[1].informe?.id,
    );
  });

  it('muestra el aviso durante la gracia del tercer trimestre y lo oculta al cerrar', () => {
    jasmine.clock().install();
    try {
      jasmine.clock().mockDate(new Date('2026-10-01T05:00:00Z'));
      component['calcularFechasClave']();
      expect(component.informeProximoACerrar).toBeTrue();
      expect(component.formatearTrimestre(component.getTrimestresActual())).toBe('3er');

      jasmine.clock().mockDate(new Date('2026-10-14T04:59:59Z'));
      component['calcularFechasClave']();
      expect(component.informeProximoACerrar).toBeTrue();
      expect(component.obtenerMensajeDisponibilidadInforme()).toContain('cierre automático');
      expect(component.obtenerMensajeDisponibilidadInforme()).toContain('14 de octubre de 2026');

      jasmine.clock().mockDate(new Date('2026-10-14T05:05:00Z'));
      component['calcularFechasClave']();
      expect(component.informeProximoACerrar).toBeFalse();
      expect(component.formatearTrimestre(component.getTrimestresActual())).toBe('4to');
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('aplica la misma regla al cuarto trimestre al cambiar de año', () => {
    jasmine.clock().install();
    try {
      jasmine.clock().mockDate(new Date('2027-01-01T05:00:00Z'));
      component['calcularFechasClave']();
      expect(component.informeProximoACerrar).toBeTrue();
      expect(component.getAnioInforme()).toBe(2026);
      expect(component.formatearTrimestre(component.getTrimestresActual())).toBe('4to');
      expect(component.formatearTrimestre((component.getTrimestresActual() % 4) + 1)).toBe('1er');
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
