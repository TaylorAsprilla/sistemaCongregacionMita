import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { QrCodeService } from './qr-code.service';

describe('QrCodeService', () => {
  let service: QrCodeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(QrCodeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('envia todos los filtros como parametros y conserva false', () => {
    const filtros = {
      usuario: '#12.345', dispositivo: 'Android', ubicacion: 'Ciudad', accesoDe: 'guarda',
      resultado: 'RECHAZADO', identidad: 'NO_VERIFICADA', motivoRechazo: 'CODIGO_INVALIDO',
      fechaDesde: '2026-10-01T04:00:00.000Z', fechaHasta: '2026-11-01T04:00:00.000Z',
    };
    service.obtenerListadoAccesos(2, 20, 'true', 'Casa Nueva', 'false', filtros).subscribe();
    const peticion = http.expectOne((req) => req.url.endsWith('/accesoqr/listadoAccesos'));
    expect(peticion.request.params.get('page')).toBe('2');
    expect(peticion.request.params.get('limit')).toBe('20');
    expect(peticion.request.params.get('esGuarda')).toBe('true');
    expect(peticion.request.params.get('esCuidadora')).toBe('false');
    expect(peticion.request.params.get('puesto')).toBe('Casa Nueva');
    for (const [campo, valor] of Object.entries(filtros)) {
      expect(peticion.request.params.get(campo)).toBe(valor);
    }
    peticion.flush({ ok: true, msg: '', data: [] });
  });

  it('omite filtros vacios y recorta espacios', () => {
    service.obtenerListadoAccesos(1, 10, '', '  ', '', { usuario: ' Prueba ', ubicacion: ' ' }).subscribe();
    const peticion = http.expectOne((req) => req.url.endsWith('/accesoqr/listadoAccesos'));
    expect(peticion.request.params.keys()).toEqual(['page', 'limit', 'usuario']);
    expect(peticion.request.params.get('usuario')).toBe('Prueba');
    peticion.flush({ ok: true, msg: '', data: [] });
  });
});
