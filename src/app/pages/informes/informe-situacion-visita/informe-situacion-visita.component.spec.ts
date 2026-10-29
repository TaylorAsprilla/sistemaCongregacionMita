import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { SituacionVisitaService } from 'src/app/services/situacion-visita/situacion-visita.service';

import { InformeSituacionVisitaComponent } from './informe-situacion-visita.component';

describe('SituacionVisitaComponent', () => {
  let component: InformeSituacionVisitaComponent;
  let fixture: ComponentFixture<InformeSituacionVisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InformeSituacionVisitaComponent],
    providers: [
      {
        provide: InformeService,
        useValue: {
          informeActivoId: 1,
          obtenerContextoActivo: () => of({ id: 1, tipo_congregacion: 'CONGREGACION', nombre_unidad: 'Prueba' }),
        },
      },
      { provide: SituacionVisitaService, useValue: { getSituacionVisitasByInforme: () => of([]) } },
    ],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeSituacionVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
