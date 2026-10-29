import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { InformeService } from 'src/app/services/informe/informe.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { InformeActividadesComponent } from './informe-actividades.component';

describe('InformeActividadesComponent', () => {
  let component: InformeActividadesComponent;
  let fixture: ComponentFixture<InformeActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeActividadesComponent],
      providers: [
        { provide: UsuarioService, useValue: { usuarioNombre: 'Usuario de prueba' } },
        {
          provide: InformeService,
          useValue: {
            informeActivoId: 1,
            obtenerContextoActivo: () => of({ id: 1, tipo_congregacion: 'CONGREGACION', nombre_unidad: 'Prueba' }),
          },
        },
        { provide: TipoActividadService, useValue: { getTipoActividad: () => of([]) } },
        { provide: ActividadService, useValue: { getActividadesByInforme: () => of([]) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
