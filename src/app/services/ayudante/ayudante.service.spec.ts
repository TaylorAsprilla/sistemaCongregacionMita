import { TestBed } from '@angular/core/testing';

import { AyudanteService } from './ayudante.service';

describe('AyudanteService', () => {
  let service: AyudanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AyudanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
