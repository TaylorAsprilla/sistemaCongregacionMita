import { TestBed } from '@angular/core/testing';

import { RazonSolicitudService } from './razon-solicitud.service';

describe('RazonSolicitudService', () => {
  let service: RazonSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazonSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
