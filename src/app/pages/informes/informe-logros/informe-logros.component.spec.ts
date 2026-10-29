import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InformeService } from 'src/app/services/informe/informe.service';
import { LogroService } from 'src/app/services/logro/logro.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { InformeLogrosComponent } from './informe-logros.component';

describe('InformeLogrosComponent', () => {
  let component: InformeLogrosComponent;
  let fixture: ComponentFixture<InformeLogrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeLogrosComponent],
      providers: [
        { provide: UsuarioService, useValue: { usuarioNombre: 'Usuario de prueba' } },
        {
          provide: InformeService,
          useValue: {
            informeActivoId: 1,
            obtenerContextoActivo: () => of({ id: 1, tipo_congregacion: 'CONGREGACION', nombre_unidad: 'Prueba' }),
          },
        },
        { provide: LogroService, useValue: { getLogrosByInforme: () => of([]) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeLogrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
