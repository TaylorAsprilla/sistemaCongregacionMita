import { TestBed } from '@angular/core/testing';

import { DosisResolver } from './dosis.resolver';

describe('DosisResolver', () => {
  let resolver: DosisResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DosisResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
