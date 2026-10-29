import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsuariosPorCongregacionService } from 'src/app/services/usuarios-por-congregacion/usuarios-por-congregacion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import CensoObreroComponent from './censo-obrero.component';

describe('CensoObreroComponent', () => {
  let component: CensoObreroComponent;
  let fixture: ComponentFixture<CensoObreroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CensoObreroComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuarioId: 1,
            nombreCongregacion: 'Congregación de prueba',
            isAdministradorPais: false,
            usuario: { id: 1, usuarioPermiso: [] },
          },
        },
        {
          provide: UsuariosPorCongregacionService,
          useValue: { listarUsuariosPorCongregacion: () => of({ totalUsuarios: 0, usuarios: [] }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CensoObreroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
