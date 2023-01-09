import { TestBed } from '@angular/core/testing';

import { TipoEstudioService } from './tipo-estudio.service';

describe('TipoEstudioService', () => {
  let service: TipoEstudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoEstudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
