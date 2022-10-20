import { TestBed } from '@angular/core/testing';

import { TipoEmpleoService } from './tipo-empleo.service';

describe('TipoEmpleoService', () => {
  let service: TipoEmpleoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEmpleoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
