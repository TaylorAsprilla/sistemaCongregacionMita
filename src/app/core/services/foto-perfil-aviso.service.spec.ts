import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilAvisoService } from './foto-perfil-aviso.service';
import { FotoPerfilDialogoService } from './foto-perfil-dialogo.service';
import { FotoPerfilService } from './foto-perfil.service';

describe('FotoPerfilAvisoService', () => {
  let servicio: FotoPerfilAvisoService;
  let usuarioService: { usuario: any; isQRLogin: boolean };
  let fotoService: { consultarPropia: jasmine.Spy };
  let dialogo: { abrirSelector: jasmine.Spy };
  let fire: jasmine.Spy;

  beforeEach(() => {
    localStorage.removeItem('fotoPerfilAviso:7');
    usuarioService = { usuario: { id: 7, primerNombre: 'Ana', foto: null }, isQRLogin: false };
    fotoService = { consultarPropia: jasmine.createSpy().and.returnValue(of({ foto: null })) };
    dialogo = { abrirSelector: jasmine.createSpy().and.returnValue(true) };
    fire = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    spyOn(Swal, 'isVisible').and.returnValue(false);
    TestBed.configureTestingModule({
      providers: [
        { provide: UsuarioService, useValue: usuarioService },
        { provide: FotoPerfilService, useValue: fotoService },
        { provide: FotoPerfilDialogoService, useValue: dialogo },
      ],
    });
    servicio = TestBed.inject(FotoPerfilAvisoService);
  });

  afterEach(() => localStorage.removeItem('fotoPerfilAviso:7'));

  it('muestra una invitación amable la primera vez a quien no tiene foto', async () => {
    expect(await servicio.mostrarSiCorresponde()).toBeTrue();
    expect(fire).toHaveBeenCalledTimes(1);
    const opciones = fire.calls.mostRecent().args[0];
    expect(opciones.titleText).toBe('¡Hola, Ana!');
    expect(opciones.confirmButtonText).toBe('Subir mi fotografía');
    expect(opciones.cancelButtonText).toBe('Ahora no');
    expect(servicio.yaVisto(7)).toBeTrue();
  });

  it('no se repite en ingresos posteriores', async () => {
    await servicio.mostrarSiCorresponde();
    fire.calls.reset();
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(fire).not.toHaveBeenCalled();
  });

  it('si el usuario acepta, abre el selector de fotografía', async () => {
    fire.and.resolveTo({ isConfirmed: true } as any);
    await servicio.mostrarSiCorresponde();
    expect(dialogo.abrirSelector).toHaveBeenCalledTimes(1);
  });

  it('si responde "Ahora no", no abre el selector pero tampoco vuelve a insistir', async () => {
    await servicio.mostrarSiCorresponde();
    expect(dialogo.abrirSelector).not.toHaveBeenCalled();
    expect(servicio.yaVisto(7)).toBeTrue();
  });

  it('no molesta a quien ya tiene fotografía', async () => {
    usuarioService.usuario.foto = 'usuarios/fotos-perfil/7/a.webp';
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(fire).not.toHaveBeenCalled();
    expect(servicio.yaVisto(7)).toBeTrue();
  });

  it('si no conoce la foto la consulta al servidor antes de decidir', async () => {
    usuarioService.usuario.foto = undefined;
    fotoService.consultarPropia.and.returnValue(of({ foto: 'usuarios/fotos-perfil/7/a.webp' }));
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(fotoService.consultarPropia).toHaveBeenCalledTimes(1);
  });

  it('si la consulta falla no muestra nada y lo reintenta en el próximo ingreso', async () => {
    usuarioService.usuario.foto = undefined;
    fotoService.consultarPropia.and.returnValue(throwError(() => new Error('red')));
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(servicio.yaVisto(7)).toBeFalse();
  });

  it('no se superpone a otro aviso abierto y no se da por visto', async () => {
    (Swal.isVisible as jasmine.Spy).and.returnValue(true);
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(servicio.yaVisto(7)).toBeFalse();
  });

  it('no aplica a sesiones QR ni sin usuario', async () => {
    usuarioService.isQRLogin = true;
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    usuarioService.isQRLogin = false;
    usuarioService.usuario = undefined;
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(fire).not.toHaveBeenCalled();
  });
});
