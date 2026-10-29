import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PerfilComponent } from './perfil.component';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  beforeEach(async () => {
    const paises = Object.assign([{ id: 1, pais: 'País de prueba', estado: true }], { pais: 'País de prueba' });
    const congregaciones = Object.assign(
      [{ id: 1, congregacion: 'Congregación de prueba', estado: true }],
      { congregacion: 'Congregación de prueba' },
    );
    const usuario = {
      id: 1,
      primerNombre: 'Usuario',
      segundoNombre: '',
      primerApellido: 'Prueba',
      segundoApellido: '',
      fechaNacimiento: new Date('2000-01-01'),
      genero: { id: 1 },
      estadoCivil: { id: 1 },
      nacionalidad: { nombre: 'Prueba' },
      rolCasa: { id: 1 },
      gradoAcademico: { id: 1 },
      categoriaProfesion: { id: 1 },
      tipoMiembro: { id: 1 },
      tipoDocumento: { id: 1 },
      usuarioMinisterio: [],
      usuarioVoluntariado: [],
      usuarioCongregacionPais: paises,
      usuarioCongregacionCongregacion: congregaciones,
      usuarioCongregacionCampo: [{ id: 1, campo: 'Campo de prueba' }],
    };
    const catalogos = {
      nacionalidades: [],
      estadoCivil: [],
      rolCasa: [],
      generos: [],
      gradosAcademicos: [],
      tipoMiembros: [],
      congregaciones: [],
      ministerios: [],
      voluntariados: [],
      paises: [],
      campos: [],
      tiposDeDocumentos: [],
      categoriasProfesion: [],
    };
    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ perfilData: { catalogos, usuario: { usuario } } }), params: of({}) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
