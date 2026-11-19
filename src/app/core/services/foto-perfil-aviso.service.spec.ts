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
  let fotoService: { consultarPropia: jasmine.Spy; marcarTourVisto: jasmine.Spy };
  let tour: { iniciar: jasmine.Spy };

  beforeEach(() => {
    localStorage.removeItem('fotoPerfilAviso:7');
    usuarioService = { usuario: { id: 7, primerNombre: 'Ana', foto: null }, isQRLogin: false };
    fotoService = {
      consultarPropia: jasmine.createSpy().and.returnValue(of({ foto: null, tourVisto: false })),
      marcarTourVisto: jasmine.createSpy().and.returnValue(of({ ok: true, guardado: true })),
    };
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

  it('registra en el servidor que ya lo vio al iniciarlo', async () => {
    await servicio.mostrarSiCorresponde();
    expect(fotoService.marcarTourVisto).toHaveBeenCalledTimes(1);
  });

  it('si el servidor dice que ya lo vio (otro navegador), no lo muestra y lo recuerda localmente', async () => {
    fotoService.consultarPropia.and.returnValue(of({ foto: null, tourVisto: true }));
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(tour.iniciar).not.toHaveBeenCalled();
    expect(servicio.yaVisto(7)).toBeTrue();
  });

  it('si el servidor no sabe (migración pendiente), se apoya en el respaldo local', async () => {
    fotoService.consultarPropia.and.returnValue(of({ foto: null, tourVisto: null }));
    expect(await servicio.mostrarSiCorresponde()).toBeTrue();
    tour.iniciar.calls.reset();
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
  });

  it('no molesta a quien ya tiene fotografía y lo deja registrado', async () => {
    fotoService.consultarPropia.and.returnValue(of({ foto: 'usuarios/fotos-perfil/7/a.webp', tourVisto: false }));
    expect(await servicio.mostrarSiCorresponde()).toBeFalse();
    expect(tour.iniciar).not.toHaveBeenCalled();
    expect(servicio.yaVisto(7)).toBeTrue();
    expect(fotoService.marcarTourVisto).toHaveBeenCalledTimes(1);
  });

  it('si falla el registro en el servidor, el tour igualmente se muestra', async () => {
    fotoService.marcarTourVisto.and.returnValue(throwError(() => new Error('red')));
    expect(await servicio.mostrarSiCorresponde()).toBeTrue();
    expect(tour.iniciar).toHaveBeenCalledTimes(1);
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
    fotoService.consultarPropia.and.returnValue(of({ foto: 'no-image.jpg', tourVisto: false }));
    expect(await servicio.mostrarSiCorresponde()).toBeTrue();
    expect(tour.iniciar).toHaveBeenCalledTimes(1);
  });
});
