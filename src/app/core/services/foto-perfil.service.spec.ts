import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { environment } from 'environment';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilService } from './foto-perfil.service';
import { MENSAJES_FOTO } from '../utils/foto-perfil';

const api = `${environment.base_url}/foto-perfil`;

describe('FotoPerfilService', () => {
  let servicio: FotoPerfilService;
  let http: HttpTestingController;
  let usuario: { id: number; foto?: string | null };

  beforeEach(() => {
    usuario = { id: 7, foto: undefined };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UsuarioService, useValue: { token: 'jwt', usuario, usuarioId: 7 } },
      ],
    });
    servicio = TestBed.inject(FotoPerfilService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('agrupa las consultas de varios avatares en una sola petición y cachea el resultado', fakeAsync(() => {
    const resultados: (string | null)[] = [];
    servicio.resolverUrl(7).then((u) => resultados.push(u));
    servicio.resolverUrl(8).then((u) => resultados.push(u));
    servicio.resolverUrl(7).then((u) => resultados.push(u));
    tick(50);

    const peticion = http.expectOne(`${api}/urls`);
    expect(peticion.request.headers.get('x-token')).toBe('jwt');
    expect(peticion.request.body.ids.sort()).toEqual([7, 8]);
    peticion.flush({ ok: true, expiraEn: 900, fotos: { '7': { foto: 'usuarios/fotos-perfil/7/a.webp', url: 'https://s3/a' } } });
    tick();

    // Los avatares del usuario 7 se resuelven juntos y luego el 8 (sin foto).
    expect(resultados).toEqual(['https://s3/a', 'https://s3/a', null]);

    // Segunda lectura: sale de caché, sin nueva petición.
    let otra: string | null | undefined;
    servicio.resolverUrl(7).then((u) => (otra = u));
    tick(50);
    expect(otra).toBe('https://s3/a');
    http.expectNone(`${api}/urls`);
  }));

  it('no consulta nada cuando ya se sabe que no hay fotografía', fakeAsync(() => {
    let url: string | null | undefined;
    servicio.resolverUrl(7, null).then((u) => (url = u));
    tick(50);
    expect(url).toBeNull();
    http.expectNone(`${api}/urls`);
  }));

  it('si falla la consulta responde null (iniciales) sin lanzar error', fakeAsync(() => {
    let url: string | null | undefined = 'x';
    servicio.resolverUrl(9).then((u) => (url = u));
    tick(50);
    http.expectOne(`${api}/urls`).flush({}, { status: 500, statusText: 'Error' });
    tick();
    expect(url).toBeNull();
  }));

  it('subir actualiza usuario en memoria, caché y notifica el cambio', () => {
    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/webp' });
    const progresos: number[] = [];
    servicio.subir(blob).subscribe((e) => progresos.push(e.progreso));

    const peticion = http.expectOne(api);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.headers.get('x-token')).toBe('jwt');
    expect(peticion.request.headers.get('Content-Type')).toBe('image/webp');
    expect(peticion.request.body).toBe(blob);
    peticion.flush({ ok: true, foto: 'usuarios/fotos-perfil/7/nueva.webp', url: 'https://s3/nueva', expiraEn: 900 });

    expect(progresos[progresos.length - 1]).toBe(100);
    expect(usuario.foto).toBe('usuarios/fotos-perfil/7/nueva.webp');
    expect(servicio.cambio()).toEqual(jasmine.objectContaining({ id: 7, foto: 'usuarios/fotos-perfil/7/nueva.webp' }));
  });

  it('eliminar deja la foto en null y notifica el cambio', () => {
    usuario.foto = 'usuarios/fotos-perfil/7/a.webp';
    servicio.eliminar().subscribe();
    const peticion = http.expectOne(api);
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush({ ok: true, foto: null });
    expect(usuario.foto).toBeNull();
    expect(servicio.cambio().foto).toBeNull();
  });

  it('un error al subir no modifica la fotografía anterior', () => {
    usuario.foto = 'usuarios/fotos-perfil/7/vieja.webp';
    let fallo: unknown;
    servicio.subir(new Blob(['x'], { type: 'image/png' })).subscribe({ error: (e) => (fallo = e) });
    http.expectOne(api).flush({ code: 'ALMACENAMIENTO_ERROR' }, { status: 502, statusText: 'Bad Gateway' });
    expect(fallo).toBeTruthy();
    expect(usuario.foto).toBe('usuarios/fotos-perfil/7/vieja.webp');
    expect(servicio.cambio().revision).toBe(0);
  });

  it('traduce los códigos del backend a mensajes claros', () => {
    const error = (code: string, status = 400) => new HttpErrorResponse({ status, error: { code, message: 'x' } });
    expect(servicio.mensajeDeError(error('IMAGEN_MUY_GRANDE', 413))).toBe(MENSAJES_FOTO.tamano);
    expect(servicio.mensajeDeError(error('FORMATO_NO_PERMITIDO', 415))).toBe(MENSAJES_FOTO.formato);
    expect(servicio.mensajeDeError(error('IMAGEN_CORRUPTA'))).toBe(MENSAJES_FOTO.corrupta);
    expect(servicio.mensajeDeError(new HttpErrorResponse({ status: 0 }))).toContain('conexión');
    expect(servicio.mensajeDeError(error('ALMACENAMIENTO_ERROR', 502))).toBe(MENSAJES_FOTO.subida);
  });

  it('marcarTourVisto envía POST a /tour-visto con el token', () => {
    let resultado: any;
    servicio.marcarTourVisto().subscribe((r) => (resultado = r));
    const peticion = http.expectOne(`${api}/tour-visto`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.headers.has('x-token')).toBeTrue();
    peticion.flush({ ok: true, guardado: true });
    expect(resultado.guardado).toBeTrue();
  });
});
