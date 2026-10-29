import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { SolicitudesPendienteComponent } from './solicitudes-pendiente.component';

describe('SolicitudesPendienteComponent', () => {
  let component: SolicitudesPendienteComponent;
  let fixture: ComponentFixture<SolicitudesPendienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesPendienteComponent],
      providers: [
        { provide: UsuarioService, useValue: { usuario: { id: 1 } } },
        { provide: SolicitudMultimediaService, useValue: { getSolicitudesPendientes: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudesPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
