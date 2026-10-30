import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { QrCodeService } from 'src/app/services/qrCode/qr-code.service';
import ListadoAccesosQRComponent from './listado-accesos-qr.component';

describe('ListadoAccesosQRComponent', () => {
  let component: ListadoAccesosQRComponent;
  let fixture: ComponentFixture<ListadoAccesosQRComponent>;
  let servicio: jasmine.SpyObj<QrCodeService>;

  beforeEach(async () => {
    servicio = jasmine.createSpyObj<QrCodeService>('QrCodeService', ['obtenerListadoAccesos']);
    servicio.obtenerListadoAccesos.and.returnValue(of({
      ok: true, msg: '', data: [{
        id: 1, idQrCode: 2, idUsuario: 7, nombre: 'Histórico', ip: '', dispositivo: '',
        createdAt: '2026-01-01', tipoPuesto: 'guarda', esGuarda: null, esCuidadora: null, enTurnoGuarda: null,
        puesto: null, resultado: null, resultadoIdentidad: null, motivoRechazo: null,
      }],
    }));
    await TestBed.configureTestingModule({
      imports: [ListadoAccesosQRComponent],
      providers: [provideRouter([]), { provide: QrCodeService, useValue: servicio }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoAccesosQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mantiene visibles los historicos sin inventar respuestas de guarda', () => {
    expect(fixture.nativeElement.textContent).toContain('Histórico');
    expect(fixture.nativeElement.textContent).toContain('Sin registro');
  });

  it('muestra las nueve columnas solicitadas en orden', () => {
    const encabezados = Array.from(fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>)
      .map((celda) => celda.textContent?.trim());
    expect(encabezados).toEqual([
      'Usuario', 'Dispositivo', 'Ubicación', 'Acceso de', 'Puesto',
      'Resultado', 'Identidad', 'Motivo de rechazo', 'Fecha',
    ]);
  });

  it('muestra ciudad y pais y distingue guarda, cuidadora, otro e historico', () => {
    const historico = component.accesosQr[0];
    component.accesosQr = [
      { ...historico, esGuarda: true, esCuidadora: false, ubicacion: { ciudad: 'Ciudad de prueba', pais: 'Pais de prueba' } },
      { ...historico, esGuarda: false, esCuidadora: true, ubicacion: { ciudad: null, pais: 'Pais de prueba' } },
      { ...historico, esGuarda: false, esCuidadora: false, ubicacion: null },
      historico,
    ];
    fixture.detectChanges();
    const filas = fixture.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    expect(filas[0].cells[2].textContent?.trim()).toBe('Ciudad de prueba, Pais de prueba');
    expect(filas[1].cells[2].textContent?.trim()).toBe('Pais de prueba');
    expect(filas[2].cells[2].textContent?.trim()).toBe('Sin registro');
    expect(Array.from(filas).map((fila) => fila.cells[3].textContent?.trim()))
      .toEqual(['Guarda', 'Cuidadora', 'Otro', 'Sin registro']);
  });

  it('combina filtros de guarda, cuidadora y puesto y vuelve a la primera pagina', () => {
    component.currentPage = 3;
    component.filtroGuarda = 'true';
    component.filtroCuidadora = 'false';
    component.filtroPuesto = 'Casa Nueva';
    component.aplicarFiltros();
    expect(servicio.obtenerListadoAccesos).toHaveBeenCalledWith(1, 10, 'true', 'Casa Nueva', 'false', {});
  });

  it('aplica todas las columnas y conserva filtros al paginar aunque se edite el formulario', () => {
    component.filtros = {
      usuario: 'Prueba', dispositivo: 'Android', ubicacion: 'Ciudad',
      accesoDe: 'cuidadora', resultado: 'EXITOSO', identidad: 'VERIFICADA',
      motivoRechazo: 'Sin registro', fechaDesde: '2026-10-01', fechaHasta: '2026-10-30',
    };
    component.aplicarFiltros();
    const filtrosEnviados = servicio.obtenerListadoAccesos.calls.mostRecent().args[5];
    const hasta = new Date('2026-10-31T00:00:00').toISOString();
    expect(filtrosEnviados).toEqual({
      ...component.filtros, fechaDesde: new Date('2026-10-01T00:00:00').toISOString(), fechaHasta: hasta,
    });
    component.filtros.usuario = 'Sin aplicar';
    component.goToPage(2);
    expect(servicio.obtenerListadoAccesos).toHaveBeenCalledWith(2, 10, '', '', '', filtrosEnviados);
    expect(servicio.obtenerListadoAccesos.calls.mostRecent().args[5]?.usuario).toBe('Prueba');
  });

  it('limpia todos los filtros y vuelve a la primera pagina', () => {
    component.filtros = { usuario: 'Prueba', accesoDe: 'guarda', fechaDesde: '2026-10-01' };
    component.filtroGuarda = 'true';
    component.filtroCuidadora = 'false';
    component.filtroPuesto = 'Casa Nueva';
    component.currentPage = 3;
    component.limpiarFiltros();
    expect(component.filtros).toEqual({});
    expect(servicio.obtenerListadoAccesos).toHaveBeenCalledWith(1, 10, '', '', '', {});
  });

  it('rechaza rangos de fechas invertidos sin consultar', () => {
    spyOn(component, 'mostrarError');
    servicio.obtenerListadoAccesos.calls.reset();
    component.filtros = { fechaDesde: '2026-10-30', fechaHasta: '2026-10-01' };
    component.aplicarFiltros();
    expect(component.mostrarError).toHaveBeenCalled();
    expect(servicio.obtenerListadoAccesos).not.toHaveBeenCalled();
  });

  it('muestra total cero y conserva formulario y encabezados cuando no hay coincidencias', () => {
    servicio.obtenerListadoAccesos.and.returnValue(of({
      ok: true, msg: '', data: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false },
    }));
    component.aplicarFiltros();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Total de Accesos QR (0)');
    expect(fixture.nativeElement.textContent).toContain('No se encontraron accesos con los filtros seleccionados.');
    expect(fixture.nativeElement.querySelectorAll('thead th').length).toBe(9);
    expect(fixture.nativeElement.querySelector('#filtroUsuario')).toBeTruthy();
  });
});
