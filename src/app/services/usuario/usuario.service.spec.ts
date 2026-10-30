import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SessionMonitorService } from 'src/app/core/services/session-monitor.service';
import { ROLES } from 'src/app/routes/menu-items';

import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: SessionMonitorService, useValue: {} },
      ],
    });
    service = TestBed.inject(UsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reconoce el rol ADMINISTRADOR PAÍS con tilde', () => {
    spyOnProperty(service, 'role', 'get').and.returnValue([ROLES.ADMINISTRADOR_PAIS]);
    expect(service.isAdministradorPais).toBeTrue();
  });

  it('no reconoce otros roles como administrador del país', () => {
    spyOnProperty(service, 'role', 'get').and.returnValue([ROLES.OBRERO_PAIS]);
    expect(service.isAdministradorPais).toBeFalse();
  });
});
