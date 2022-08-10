import { TestBed } from '@angular/core/testing';

import { NacionalidadResolver } from './nacionalidad.resolver';

describe('NacionalidadResolver', () => {
  let resolver: NacionalidadResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NacionalidadResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
