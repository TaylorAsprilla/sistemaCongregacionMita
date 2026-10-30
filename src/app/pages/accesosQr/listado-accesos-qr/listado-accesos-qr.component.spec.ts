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
        createdAt: '2026-01-01', tipoPuesto: 'guarda', esGuarda: null, enTurnoGuarda: null,
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

  it('filtra por guarda y puesto y vuelve a la primera pagina', () => {
    component.currentPage = 3;
    component.filtroGuarda = 'true';
    component.filtroPuesto = 'Casa Nueva';
    component.aplicarFiltros();
    expect(servicio.obtenerListadoAccesos).toHaveBeenCalledWith(1, 10, 'true', 'Casa Nueva');
  });
});
