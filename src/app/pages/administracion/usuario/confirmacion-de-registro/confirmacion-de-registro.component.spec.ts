import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

import ConfirmacionDeRegistroComponent from './confirmacion-de-registro.component';

describe('ConfirmacionDeRegistroComponent', () => {
  let component: ConfirmacionDeRegistroComponent;
  let fixture: ComponentFixture<ConfirmacionDeRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionDeRegistroComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }), data: of({}) },
        },
        {
          provide: UsuarioService,
          useValue: {
            getUsuario: () =>
              of({
                usuario: {
                  id: 1,
                  primerNombre: 'Usuario',
                  segundoNombre: '',
                  primerApellido: 'Prueba',
                  segundoApellido: '',
                },
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacionDeRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
