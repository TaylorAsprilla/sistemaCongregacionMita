import { TestBed } from '@angular/core/testing';

import { EstadoCivilResolver } from './estado-civil.resolver';

describe('EstadoCivilResolver', () => {
  let resolver: EstadoCivilResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EstadoCivilResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
