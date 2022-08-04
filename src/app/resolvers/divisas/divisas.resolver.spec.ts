import { TestBed } from '@angular/core/testing';

import { DivisasResolver } from './divisas.resolver';

describe('DivisasResolver', () => {
  let resolver: DivisasResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DivisasResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
