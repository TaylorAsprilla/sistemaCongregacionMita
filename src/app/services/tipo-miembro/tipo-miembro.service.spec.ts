import { TestBed } from '@angular/core/testing';

import { TipoMiembroService } from './tipo-miembro.service';

describe('TipoMiembroService', () => {
  let service: TipoMiembroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoMiembroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
