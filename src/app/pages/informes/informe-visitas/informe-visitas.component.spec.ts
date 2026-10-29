import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { VisitaService } from 'src/app/services/visita/visita.service';

import { InformeVisitasComponent } from './informe-visitas.component';

describe('InformeVisitasComponent', () => {
  let component: InformeVisitasComponent;
  let fixture: ComponentFixture<InformeVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeVisitasComponent],
      providers: [
        {
          provide: InformeService,
          useValue: {
            informeActivoId: 1,
            obtenerContextoActivo: () => of({ id: 1, tipo_congregacion: 'CONGREGACION', nombre_unidad: 'Prueba' }),
          },
        },
        { provide: VisitaService, useValue: { getVisitasByInforme: () => of([]) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
