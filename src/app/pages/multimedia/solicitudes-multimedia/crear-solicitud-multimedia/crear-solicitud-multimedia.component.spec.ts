import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { RAZON_SOLICITUD_ID } from 'src/app/core/models/solicitud-multimedia.model';

import { CrearSolicitudMultimediaComponent } from './crear-solicitud-multimedia.component';

describe('CrearSolicitudMultimediaComponent', () => {
  let component: CrearSolicitudMultimediaComponent;
  let fixture: ComponentFixture<CrearSolicitudMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitudMultimediaComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { data: of({}) } },
        { provide: SolicitudMultimediaService, useValue: {} },
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

  it('conserva las preguntas y su validación al cambiar persona encamada', () => {
    component.tipoDeSolicitud(RAZON_SOLICITUD_ID.ENFERMEDAD);
    component.solicitudForm.patchValue({
      personaEncamada: true, enfermedadCronica: false,
      personaInmunosuprimida: false, impedimentoSalirCasa: false,
    });
    component.agregarControlPersonaEncamada();
    expect(component.solicitudForm.contains('personaEncargada')).toBeTrue();
    component.solicitudForm.get('personaEncamada')?.setValue(false);
    component.eliminarControlPersonaEncamada();
    expect(component.solicitudForm.contains('personaEncargada')).toBeFalse();
    expect(component.solicitudForm.contains('enfermedadCronica')).toBeTrue();
    expect(component.solicitudForm.hasError('enfermedadNoElegible')).toBeTrue();
    component.solicitudForm.get('personaInmunosuprimida')?.setValue(true);
    expect(component.solicitudForm.hasError('enfermedadNoElegible')).toBeFalse();
  });

  it('no envía una solicitud con cuatro No y limpia las preguntas al cambiar de motivo', () => {
    component.tipoDeSolicitud(RAZON_SOLICITUD_ID.ENFERMEDAD);
    component.solicitudForm.patchValue({
      personaEncamada: false, enfermedadCronica: false,
      personaInmunosuprimida: false, impedimentoSalirCasa: false,
      razonSolicitud_id: RAZON_SOLICITUD_ID.ENFERMEDAD,
      observaciones: 'Prueba', terminos: true,
    });
    const crear = spyOn(component, 'crearNuevaSolicitud');
    component.crearSolicitud();
    expect(component.solicitudForm.invalid).toBeTrue();
    expect(crear).not.toHaveBeenCalled();
    component.tipoDeSolicitud(RAZON_SOLICITUD_ID.OTRA);
    expect(component.solicitudForm.contains('personaInmunosuprimida')).toBeFalse();
    expect(component.solicitudForm.hasError('enfermedadNoElegible')).toBeFalse();
  });
});
