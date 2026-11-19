import { TestBed } from '@angular/core/testing';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilDialogoService } from './foto-perfil-dialogo.service';
import { FotoPerfilTourService } from './foto-perfil-tour.service';

describe('FotoPerfilTourService', () => {
  let servicio: FotoPerfilTourService;
  let dialogo: { abrirSelector: jasmine.Spy };

  beforeEach(() => {
    dialogo = { abrirSelector: jasmine.createSpy().and.returnValue(true) };
    TestBed.configureTestingModule({
      providers: [
        { provide: UsuarioService, useValue: { usuario: { id: 7, primerNombre: 'Ana' } } },
        { provide: FotoPerfilDialogoService, useValue: dialogo },
      ],
    });
    servicio = TestBed.inject(FotoPerfilTourService);
  });

  it('arma 4 pasos: bienvenida, clic en la foto, ajuste y guardado', () => {
    const avatar = document.createElement('button');
    const pasos = servicio.construirPasos('Ana', avatar, () => {});
    expect(pasos.length).toBe(4);
    expect(pasos[0].popover?.title).toContain('¡Hola, Ana!');
    expect(pasos[1].element).toBe(avatar);
    expect(pasos[2].popover?.description).toContain('JPG, PNG o WEBP');
  });

  it('sin avatar visible los pasos se muestran centrados, sin romper', () => {
    const pasos = servicio.construirPasos(undefined, undefined, () => {});
    expect(pasos[1].element).toBeUndefined();
    expect(pasos[0].popover?.title).toContain('¡Hola!');
  });

  it('el último paso cierra el tour y abre el selector', () => {
    const alTerminar = jasmine.createSpy('alTerminar');
    const pasos = servicio.construirPasos('Ana', undefined, alTerminar);
    const ultimo = pasos[3].popover!;
    expect(ultimo.doneBtnText).toBe('Subir mi fotografía');
    const guia = { destroy: jasmine.createSpy('destroy') };
    ultimo.onNextClick!(undefined, pasos[3], { driver: guia } as any);
    expect(guia.destroy).toHaveBeenCalled();
    expect(alTerminar).toHaveBeenCalled();
  });

  it('iniciar() muestra el tour en pantalla y se puede cerrar', () => {
    servicio.iniciar();
    expect(document.querySelector('.driver-popover')).not.toBeNull();
    (document.querySelector('.driver-popover-close-btn') as HTMLElement)?.click();
  });
});
