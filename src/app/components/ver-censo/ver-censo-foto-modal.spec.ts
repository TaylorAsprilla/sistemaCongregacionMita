import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { VerCensoComponent } from './ver-censo.component';

describe('VerCensoComponent: fotografía en el modal de información', () => {
  let componente: VerCensoComponent;
  let fire: jasmine.Spy;
  let resolverUrl: jasmine.Spy;

  const montar = (foto: string | null | undefined) => {
    TestBed.overrideProvider(UsuarioService, {
      useValue: {
        getUsuario: () =>
          of({ usuario: { id: 7, primerNombre: 'Ana', segundoNombre: '', primerApellido: 'Pérez', segundoApellido: '', foto } }),
      },
    });
    componente = TestBed.runInInjectionContext(() => new VerCensoComponent());
  };

  beforeEach(() => {
    fire = spyOn(Swal, 'fire').and.resolveTo({} as any);
    resolverUrl = jasmine.createSpy('resolverUrl').and.resolveTo('https://s3.test/foto.webp?firma');
    TestBed.configureTestingModule({
      providers: [
        { provide: UsuarioService, useValue: {} },
        { provide: PaisService, useValue: {} },
        { provide: CongregacionService, useValue: {} },
        { provide: CampoService, useValue: {} },
        { provide: BreakpointObserver, useValue: {} },
        { provide: ExportarExcelService, useValue: {} },
        { provide: FotoPerfilService, useValue: { resolverUrl } },
      ],
    });
  });

  const opciones = async () => {
    await new Promise((r) => setTimeout(r));
    return fire.calls.mostRecent().args[0];
  };

  it('con foto, el modal muestra la imagen circular del usuario', async () => {
    montar('usuarios/fotos-perfil/7/a.webp');
    componente.masInformacion(7);
    const o = await opciones();
    expect(resolverUrl).toHaveBeenCalledWith(7, 'usuarios/fotos-perfil/7/a.webp');
    expect(o.imageUrl).toBe('https://s3.test/foto.webp?firma');
    expect(o.customClass.image).toBe('swal-foto-usuario');
    expect(o.iconHtml).toBeUndefined();
  });

  it('sin foto, muestra las iniciales y no consulta al servidor', async () => {
    montar(null);
    componente.masInformacion(7);
    const o = await opciones();
    expect(resolverUrl).not.toHaveBeenCalled();
    expect(o.imageUrl).toBeUndefined();
    expect(o.iconHtml).toContain('swal-iniciales');
    expect(o.iconHtml).toContain('AP');
  });

  it('un valor heredado en la columna foto se ignora y se muestran iniciales', async () => {
    montar('no-image.jpg');
    componente.masInformacion(7);
    const o = await opciones();
    expect(resolverUrl).not.toHaveBeenCalled();
    expect(o.iconHtml).toContain('swal-iniciales');
  });

  it('si la foto es desconocida (undefined) la resuelve por id; si no hay URL, iniciales', async () => {
    resolverUrl.and.resolveTo(null);
    montar(undefined);
    componente.masInformacion(7);
    const o = await opciones();
    expect(resolverUrl).toHaveBeenCalledWith(7, undefined);
    expect(o.imageUrl).toBeUndefined();
    expect(o.iconHtml).toContain('swal-iniciales');
  });
});
