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
      jasmine.clock().mockDate(new Date(2026, 9, 1, 0, 0));
      component['calcularFechasClave']();
      expect(component.informeProximoACerrar).toBeTrue();
      expect(component.formatearTrimestre(component.getTrimestresActual())).toBe('3er');

      jasmine.clock().mockDate(new Date(2026, 9, 9, 0, 5));
      component['calcularFechasClave']();
      expect(component.informeProximoACerrar).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('aplica la misma regla al cuarto trimestre al cambiar de año', () => {
    jasmine.clock().install();
    try {
      jasmine.clock().mockDate(new Date(2027, 0, 1, 0, 0));
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
