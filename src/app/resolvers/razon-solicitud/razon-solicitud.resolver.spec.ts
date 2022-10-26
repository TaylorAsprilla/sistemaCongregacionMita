import { TestBed } from '@angular/core/testing';

import { RazonSolicitudResolver } from './razon-solicitud.resolver';

describe('RazonSolicitudResolver', () => {
  let resolver: RazonSolicitudResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RazonSolicitudResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
