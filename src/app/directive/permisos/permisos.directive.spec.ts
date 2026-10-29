import { TestBed } from '@angular/core/testing';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PermisosDirective } from './permisos.directive';

describe('PermisosDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TemplateRef, useValue: {} },
        { provide: ViewContainerRef, useValue: { clear: () => {}, createEmbeddedView: () => {} } },
        { provide: UsuarioService, useValue: { usuario: null, multimediaCongregacion: null } },
      ],
    });
    const directive = TestBed.runInInjectionContext(() => new PermisosDirective());
    expect(directive).toBeTruthy();
  });
});
