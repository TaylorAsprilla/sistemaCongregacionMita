import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { ContextoInformeComponent } from './contexto-informe.component';

describe('ContextoInformeComponent', () => {
  it('muestra la Congregación y el trimestre del informe activo', () => {
    TestBed.configureTestingModule({
      imports: [ContextoInformeComponent],
      providers: [{ provide: InformeService, useValue: {
        informeActivoId: 20,
        obtenerContextoActivo: () => of({
          id: 20, tipo_congregacion: 'CONGREGACION', nombre_unidad: 'Tuluá', periodo: '2026-07-01',
        }),
      } }],
    });
    const fixture = TestBed.createComponent(ContextoInformeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Congregación Ciudad: Tuluá');
    expect(fixture.nativeElement.textContent).toContain('3º trimestre de 2026');
  });

  it('no solicita un informe cuando no hay selección activa', () => {
    const obtenerContexto = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [ContextoInformeComponent],
      providers: [{ provide: InformeService, useValue: {
        informeActivoId: null, obtenerContextoActivo: obtenerContexto,
      } }],
    });
    const fixture = TestBed.createComponent(ContextoInformeComponent);
    fixture.detectChanges();
    expect(obtenerContexto).not.toHaveBeenCalled();
  });
});
