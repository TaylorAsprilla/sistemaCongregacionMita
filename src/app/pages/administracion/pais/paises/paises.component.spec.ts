import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { PaisesComponent } from './paises.component';

describe('PaisesComponent', () => {
  let component: PaisesComponent;
  let fixture: ComponentFixture<PaisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisesComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuario: { id: 1, usuarioPermiso: [] },
            isAdministradorPais: false,
            listarTodosLosUsuarios: () => of({ usuarios: [] }),
          },
        },
        { provide: PaisService, useValue: { getPaises: () => of([]), getPaisPorAdministrador: () => of(null) } },
        { provide: ExportarExcelService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
