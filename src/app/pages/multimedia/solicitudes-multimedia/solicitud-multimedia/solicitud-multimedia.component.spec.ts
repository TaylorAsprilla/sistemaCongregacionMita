import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import { SolicitudMultimediaComponent } from './solicitud-multimedia.component';

describe('SolicitudMultimediaComponent', () => {
  let component: SolicitudMultimediaComponent;
  let fixture: ComponentFixture<SolicitudMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudMultimediaComponent],
      providers: [
        { provide: UsuarioService, useValue: { usuario: { id: 1 } } },
        { provide: SolicitudMultimediaService, useValue: { getSolicitudes: () => of([]) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
