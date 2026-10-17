import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InformeService } from './informe.service';

describe('InformeService', () => {
  let service: InformeService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.removeItem('informeActivoId');
    sessionStorage.removeItem('informeActivoContexto');
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(InformeService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.removeItem('informeActivoId');
    sessionStorage.removeItem('informeActivoContexto');
  });

  it('no deja que un resumen antiguo sobrescriba el informe seleccionado', () => {
    service.informeActivo = { id: 20, nombre_unidad: 'Tuluá' };
    service.cargarResumenInforme(1, '2026-07-01', '2026-09-30', 20).subscribe();
    const anterior = http.expectOne((req) => req.url.includes('informeId=20'));
    service.informeActivo = { id: 21, nombre_unidad: 'Chile' };
    anterior.flush({ tieneInformeAbierto: true, informe: { id: 20 }, secciones: null });
    expect(service.informeActivoId).toBe(21);
    expect(service.informeActivo.nombre_unidad).toBe('Chile');
  });

  it('conserva el contexto del ámbito cuando llega el resumen del mismo informe', () => {
    service.informeActivo = { id: 20, nombre_unidad: 'Tuluá', tipo_congregacion: 'CONGREGACION' };
    service.cargarResumenInforme(1, '2026-07-01', '2026-09-30', 20).subscribe();
    http.expectOne((req) => req.url.includes('/informe/resumen')).flush({
      tieneInformeAbierto: true, informe: { id: 20, estado: 'Abierto' }, secciones: null,
    });
    expect(service.informeActivo.nombre_unidad).toBe('Tuluá');
    expect(service.informeActivo.estado).toBe('Abierto');
  });

  it('recupera el contexto persistido sin una petición adicional', () => {
    sessionStorage.setItem('informeActivoId', '20');
    sessionStorage.setItem('informeActivoContexto', JSON.stringify({
      id: 20, nombre_unidad: 'Tuluá', periodo: '2026-07-01',
    }));
    service.obtenerContextoActivo().subscribe((contexto) => expect(contexto.nombre_unidad).toBe('Tuluá'));
    http.expectNone((req) => req.url.includes('/informe/'));
  });

  it('no solicita contexto si no hay informe seleccionado', () => {
    service.obtenerContextoActivo().subscribe((contexto) => expect(contexto).toBeNull());
    http.expectNone(() => true);
  });

  it('recupera el contexto desde el envoltorio informacioninforme', () => {
    sessionStorage.setItem('informeActivoId', '20');
    service.obtenerContextoActivo().subscribe((contexto) => {
      expect(contexto.nombre_unidad).toBe('Tuluá');
    });
    http.expectOne((req) => req.url.endsWith('/informe/20')).flush({
      ok: true,
      informe: {
        informacioninforme: { id: 20, nombre_unidad: 'Tuluá', periodo: '2026-07-01' },
      },
    });
    expect(service.informeActivo.nombre_unidad).toBe('Tuluá');
    expect(service.informeActivoId).toBe(20);
    expect(JSON.parse(sessionStorage.getItem('informeActivoContexto')!).periodo).toBe('2026-07-01');
  });

  it('no reactiva un informe cuando su respuesta llega después de limpiar la selección', () => {
    service.informeActivo = { id: 20 };
    service.cargarResumenInforme(1, '2026-07-01', '2026-09-30', 20).subscribe();
    const pendiente = http.expectOne((req) => req.url.includes('/informe/resumen'));
    service.limpiarInformeActivo();
    pendiente.flush({ tieneInformeAbierto: true, informe: { id: 20 } });
    expect(service.informeActivoId).toBeNull();
  });

});
