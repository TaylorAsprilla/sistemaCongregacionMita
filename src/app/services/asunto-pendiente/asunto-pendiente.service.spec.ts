import { TestBed } from '@angular/core/testing';

import { AsuntoPendienteService } from './asunto-pendiente.service';

describe('AsuntoPendienteService', () => {
  let service: AsuntoPendienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsuntoPendienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
