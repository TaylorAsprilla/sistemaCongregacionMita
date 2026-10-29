import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DivisaService } from 'src/app/services/divisa/divisa.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { CrearPaisComponent } from './crear-pais.component';

describe('CrearPaisComponent', () => {
  let component: CrearPaisComponent;
  let fixture: ComponentFixture<CrearPaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPaisComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuario: { id: 1, usuarioPermiso: [] },
            isAdministradorPais: false,
          },
        },
        { provide: PaisService, useValue: { getPaises: () => of([]), getPaisPorAdministrador: () => of(null) } },
        { provide: DivisaService, useValue: { listarDivisa: () => of([]) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
