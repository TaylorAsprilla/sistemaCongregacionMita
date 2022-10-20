import { TestBed } from '@angular/core/testing';

import { BuscarCelularService } from './buscar-celular.service';

describe('BuscarCelularService', () => {
  let service: BuscarCelularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarCelularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
