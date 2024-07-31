import { TestBed } from '@angular/core/testing';

import { EnviarCorreoService } from './enviar-correo.service';

describe('EnviarCorreoService', () => {
  let service: EnviarCorreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviarCorreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
