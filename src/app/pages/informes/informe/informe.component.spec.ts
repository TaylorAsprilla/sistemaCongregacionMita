import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { InformeComponent } from './informe.component';

describe('InformeComponent', () => {
  let component: InformeComponent;
  let fixture: ComponentFixture<InformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: UsuarioService, useValue: { usuarioId: 1 } },
        { provide: InformeService, useValue: { cargarResumenInforme: () => of({ tieneInformeAbierto: false }) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      expect(component.obtenerMensajeDisponibilidadInforme()).toContain('martes 13 de octubre de 2026');
      expect(component.obtenerMensajeDisponibilidadInforme()).toContain('miércoles 14 de octubre de 2026');

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
