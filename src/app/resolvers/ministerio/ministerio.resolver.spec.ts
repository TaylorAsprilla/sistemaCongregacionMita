import { TestBed } from '@angular/core/testing';

import { MinisterioResolver } from './ministerio.resolver';

describe('MinisterioResolver', () => {
  let resolver: MinisterioResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MinisterioResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
