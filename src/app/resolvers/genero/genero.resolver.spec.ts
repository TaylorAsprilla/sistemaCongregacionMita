import { TestBed } from '@angular/core/testing';

import { GeneroResolver } from './genero.resolver';

describe('GeneroResolver', () => {
  let resolver: GeneroResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GeneroResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
