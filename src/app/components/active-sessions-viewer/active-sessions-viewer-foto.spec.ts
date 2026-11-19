import { TestBed } from '@angular/core/testing';
import { SessionMonitorService } from 'src/app/core/services/session-monitor.service';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import { ActiveSessionsViewerComponent } from './active-sessions-viewer.component';

describe('ActiveSessionsViewerComponent: fotografía de la persona', () => {
  let componente: ActiveSessionsViewerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SessionMonitorService, useValue: {} },
        { provide: FotoPerfilService, useValue: { resolverUrl: () => Promise.resolve(null), cambio: () => ({ id: 0, foto: null, revision: 0 }) } },
      ],
    });
    componente = TestBed.runInInjectionContext(() => new ActiveSessionsViewerComponent());
  });

  it('para una sesión de usuario devuelve su id (se mostrará su fotografía o iniciales)', () => {
    const sesion: any = { entidad: { tipo: 'usuario', id: 56, nombreCompleto: 'Ana Pérez' } };
    expect(componente.getUsuarioId(sesion)).toBe(56);
  });

  it('para congregaciones o sesiones sin entidad no hay fotografía', () => {
    expect(componente.getUsuarioId({ entidad: { tipo: 'congregacion', id: 3, nombre: 'Bogotá' } } as any)).toBeUndefined();
    expect(componente.getUsuarioId({} as any)).toBeUndefined();
  });
});
