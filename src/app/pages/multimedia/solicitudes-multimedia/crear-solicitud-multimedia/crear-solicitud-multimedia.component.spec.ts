import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { CrearSolicitudMultimediaComponent } from './crear-solicitud-multimedia.component';

describe('CrearSolicitudMultimediaComponent', () => {
  let component: CrearSolicitudMultimediaComponent;
  let fixture: ComponentFixture<CrearSolicitudMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitudMultimediaComponent],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            usuarioId: 1,
            usuarioNombre: 'Usuario de prueba',
            usuario: { id: 1 },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSolicitudMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
