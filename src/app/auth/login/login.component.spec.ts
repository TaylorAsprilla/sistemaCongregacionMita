import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UserSessionService } from 'src/app/services/user-session/user-session.service';
import { SessionMonitorService } from 'src/app/core/services/session-monitor.service';
import LoginComponent from './login.component';
import { CodigoQrRespuesta } from 'src/app/core/interfaces/usuario.interface';

describe('LoginComponent QR', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usuario: jasmine.SpyObj<UsuarioService>;
  let parametros: BehaviorSubject<Record<string, string>>;

  beforeEach(async () => {
    usuario = jasmine.createSpyObj<UsuarioService>('UsuarioService', ['solicitarCodigoQr', 'loginPorQr']);
    usuario.solicitarCodigoQr.and.returnValue(of({
      ok: true, desafio_id: 'desafio-prueba', msg: 'Si los datos permiten el acceso, recibirá un código.',
    }));
    parametros = new BehaviorSubject({ ticket: 'QR-PRUEBA' });
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false, isDenied: false, isDismissed: true });
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParams: parametros } },
        { provide: UsuarioService, useValue: usuario },
        { provide: UserSessionService, useValue: {} },
        { provide: SessionMonitorService, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function solicitar() {
    component.qrLoginForm.get('numeroMita')?.setValue('7');
    component.solicitarCodigoQr();
    component.qrLoginForm.get('codigo')?.setValue('012345');
  }

  it('solicita solo numero Mita, sin consultar ni autocompletar datos personales', () => {
    expect(fixture.nativeElement.querySelector('[formControlName="nombre"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[formControlName="codigo"]')).toBeNull();
    component.solicitarCodigoQr();
    expect(usuario.solicitarCodigoQr).not.toHaveBeenCalled();
    solicitar();
    fixture.detectChanges();
    expect(usuario.solicitarCodigoQr).toHaveBeenCalledOnceWith('QR-PRUEBA', '7');
    expect(fixture.nativeElement.querySelector('[formControlName="codigo"]')).not.toBeNull();
  });

  it('no guarda puede ingresar sin seleccionar puesto', () => {
    solicitar();
    component.qrLoginForm.get('esGuarda')?.setValue(false);
    component.actualizarGuarda();
    expect(component.qrLoginForm.get('enTurnoGuarda')?.value).toBeFalse();
    expect(component.qrLoginForm.valid).toBeTrue();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#puestoQr')).toBeNull();
  });

  it('informa la cuota de codigos y duracion de sesion antes y despues de solicitar', () => {
    const comprobarAvisos = () => {
      const texto = fixture.nativeElement.querySelector('.qr-access-info').textContent;
      expect(texto).toContain('3 códigos cada 15 minutos');
      expect(texto).toContain('4 horas');
    };
    comprobarAvisos();
    solicitar();
    fixture.detectChanges();
    comprobarAvisos();
  });

  it('muestra seis casillas y conserva un solo control para pegar o autocompletar el codigo', () => {
    solicitar();
    fixture.detectChanges();
    const casillas: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.qr-code-digit');
    expect(casillas.length).toBe(6);
    expect(Array.from(casillas, casilla => casilla.textContent?.trim()).join('')).toBe('012345');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#codigoQr');
    input.value = '654321';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.qrLoginForm.get('codigo')?.value).toBe('654321');
    expect(Array.from(casillas, casilla => casilla.textContent?.trim()).join('')).toBe('654321');
  });

  it('guarda en turno requiere uno de los cuatro puestos', () => {
    solicitar();
    component.qrLoginForm.get('esGuarda')?.setValue(true);
    component.actualizarGuarda();
    expect(component.qrLoginForm.valid).toBeFalse();
    component.qrLoginForm.get('enTurnoGuarda')?.setValue(true);
    component.actualizarPuesto();
    expect(component.qrLoginForm.valid).toBeFalse();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('#puestoQr option').length).toBe(5);
    component.qrLoginForm.get('puesto')?.setValue('Casa Nueva');
    expect(component.qrLoginForm.valid).toBeTrue();
  });

  it('salir del turno elimina el puesto y bloquea el ingreso del guarda', () => {
    solicitar();
    component.qrLoginForm.patchValue({ esGuarda: true, enTurnoGuarda: true, puesto: 'Casa Nueva' });
    component.qrLoginForm.get('enTurnoGuarda')?.setValue(false);
    component.actualizarPuesto();
    expect(component.qrLoginForm.get('puesto')?.value).toBe('');
    expect(component.qrLoginForm.valid).toBeTrue();
    expect(component.guardaFueraDeTurno).toBeTrue();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('debe estar actualmente en turno');
    component.loginConQr();
    expect(usuario.loginPorQr).not.toHaveBeenCalled();
    component.qrLoginForm.get('esGuarda')?.setValue(false);
    component.actualizarGuarda();
    expect(component.guardaFueraDeTurno).toBeFalse();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeFalse();
  });

  it('envia el desafio y codigo, nunca nombre libre ni correo', () => {
    solicitar();
    component.qrLoginForm.get('esGuarda')?.setValue(false);
    component.actualizarGuarda();
    usuario.loginPorQr.and.returnValue(throwError(() => ({ error: { msg: 'Código inválido' } })));
    component.loginConQr();
    expect(usuario.loginPorQr).toHaveBeenCalledOnceWith({
      qrCode: 'QR-PRUEBA', desafio_id: 'desafio-prueba', codigo: '012345',
      esGuarda: false, enTurnoGuarda: false, puesto: null,
    });
    expect(component.loading).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', text: 'Código inválido' }));
  });

  it('no permite doble solicitud mientras espera al servidor', () => {
    component.qrLoginForm.get('numeroMita')?.setValue('7');
    component.loading = true;
    component.solicitarCodigoQr();
    expect(usuario.solicitarCodigoQr).not.toHaveBeenCalled();
  });

  it('muestra la indicacion del backend cuando el codigo vencio o ya fue utilizado', () => {
    solicitar();
    component.qrLoginForm.get('esGuarda')?.setValue(false);
    component.actualizarGuarda();
    for (const msg of [
      'Este código venció. Solicite otro código.',
      'Este código ya fue utilizado y no puede volver a usarse.',
    ]) {
      usuario.loginPorQr.and.returnValue(throwError(() => ({ error: { msg } })));
      component.loginConQr();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', text: msg }));
      expect(component.loading).toBeFalse();
    }
  });

  it('limpiar invalida el desafio del formulario y permite cambiar el numero', () => {
    solicitar();
    component.limpiarQr();
    expect(component.desafioQr).toBeNull();
    expect(component.qrLoginForm.get('codigo')?.value).toBeNull();
    expect(component.qrLoginForm.invalid).toBeTrue();
  });

  it('el ingreso normal sigue disponible sin parametro ticket', () => {
    parametros.next({});
    fixture.detectChanges();
    expect(component.ticketQr).toBeNull();
    expect(fixture.nativeElement.querySelector('[formControlName="password"]')).not.toBeNull();
  });

  it('un cambio de ticket descarta el desafio anterior', () => {
    solicitar();
    parametros.next({ ticket: 'QR-OTRO' });
    expect(component.desafioQr).toBeNull();
    expect(component.qrLoginForm.get('codigo')?.value).toBeNull();
  });

  it('un cambio de ticket cancela la solicitud pendiente y restablece los validadores', () => {
    const respuesta = new Subject<CodigoQrRespuesta>();
    usuario.solicitarCodigoQr.and.returnValue(respuesta);
    component.qrLoginForm.patchValue({ numeroMita: '7', esGuarda: true, enTurnoGuarda: true });
    component.actualizarPuesto();
    component.solicitarCodigoQr();
    expect(component.loading).toBeTrue();
    parametros.next({ ticket: 'QR-OTRO' });
    respuesta.next({ ok: true, desafio_id: 'desafio-anterior', msg: 'Mensaje anterior' });
    expect(component.desafioQr).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.qrLoginForm.get('puesto')?.valid).toBeTrue();
  });
});
