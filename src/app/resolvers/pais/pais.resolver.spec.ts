import { TestBed } from '@angular/core/testing';

import { PaisResolver } from './pais.resolver';

describe('PaisResolver', () => {
  let resolver: PaisResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PaisResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
