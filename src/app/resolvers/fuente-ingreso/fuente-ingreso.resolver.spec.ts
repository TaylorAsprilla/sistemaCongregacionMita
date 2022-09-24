import { TestBed } from '@angular/core/testing';

import { FuenteIngresoResolver } from './fuente-ingreso.resolver';

describe('FuenteIngresoResolver', () => {
  let resolver: FuenteIngresoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FuenteIngresoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
