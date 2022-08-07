import { TestBed } from '@angular/core/testing';

import { SituacionVisitaService } from './situacion-visita.service';

describe('SituacionVisitaService', () => {
  let service: SituacionVisitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SituacionVisitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
