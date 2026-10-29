import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AyudanteService } from 'src/app/services/ayudante/ayudante.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import CensoAyudanteComponent from './censo-ayudante.component';

describe('CensoAyudanteComponent', () => {
  let component: CensoAyudanteComponent;
  let fixture: ComponentFixture<CensoAyudanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CensoAyudanteComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuarioNombre: 'Usuario de prueba',
            usuarioId: 1,
            nombreCongregacion: 'Congregación de prueba',
            usuario: { id: 1, usuarioPermiso: [] },
          },
        },
        { provide: AyudanteService, useValue: { listarUsuariosPorIdUsuario: () => of({ totalUsuarios: 0, usuarios: [] }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CensoAyudanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
