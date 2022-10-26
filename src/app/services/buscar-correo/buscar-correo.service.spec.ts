import { TestBed } from '@angular/core/testing';

import { BuscarCorreoService } from './buscar-correo.service';

describe('BuscarCorreoService', () => {
  let service: BuscarCorreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarCorreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
