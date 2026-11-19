import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilAvisoService } from './foto-perfil-aviso.service';
import { FotoPerfilTourService } from './foto-perfil-tour.service';
import { FotoPerfilService } from './foto-perfil.service';

describe('FotoPerfilAvisoService', () => {
  let servicio: FotoPerfilAvisoService;
  let usuarioService: { usuario: any; isQRLogin: boolean };
  let fotoService: { consultarPropia: jasmine.Spy };
  let tour: { iniciar: jasmine.Spy };

  beforeEach(() => {
    localStorage.removeItem('fotoPerfilAviso:7');
    usuarioService = { usuario: { id: 7, primerNombre: 'Ana', foto: null }, isQRLogin: false };
    fotoService = { consultarPropia: jasmine.createSpy().and.returnValue(of({ foto: null })) };
    tour = { iniciar: jasmine.createSpy() };
    spyOn(Swal, 'isVisible').and.returnValue(false);
    TestBed.configureTestingModule({
      providers: [
        { provide: UsuarioService, useValue: usuarioService },
        { provide: FotoPerfilService, useValue: fotoService },
        { provide: FotoPerfilTourService, useValue: tour },
      ],
    });
    servicio = TestBed.inject(FotoPerfilAvisoService);
  });

  afterEach(() => localStorage.removeItem('fotoPerfilAviso:7'));

  it('inicia el tour guiado la primera vez a quien no tiene foto', async () => {
    expect(await servicio.mostrarSiCorresponde()).toBeTrue();
    expect(tour.iniciar).toHaveBeenCalledTimes(1);
    expect(servicio.yaVisto(7)).toBeTrue();
  });

  it('no se repite en ingresos posteriores', async () => {
    await servicio.mostrarSiCorresponde();
    tour.iniciar.calls.reset();
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(tour.iniciar).not.toHaveBeenCalled();
  });

  it('no molesta a quien ya tiene fotografía', async () => {
    usuarioService.usuario.foto = 'usuarios/fotos-perfil/7/a.webp';
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(tour.iniciar).not.toHaveBeenCalled();
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
    expect(tour.iniciar).not.toHaveBeenCalled();
  });

  it('un nombre de archivo heredado NO cuenta como fotografía: se inicia el tour', async () => {
    usuarioService.usuario.foto = 'no-image.jpg';
    expect(await servicio.mostrarSiCorresponde()).toBeTrue();
    expect(tour.iniciar).toHaveBeenCalledTimes(1);
  });
});
