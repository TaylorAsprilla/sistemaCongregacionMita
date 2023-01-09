import { TestBed } from '@angular/core/testing';

import { OpcionTransporteService } from './opcion-transporte.service';

describe('OpcionTransporteService', () => {
  let service: OpcionTransporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcionTransporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
