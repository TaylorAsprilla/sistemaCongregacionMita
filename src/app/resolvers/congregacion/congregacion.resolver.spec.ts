import { TestBed } from '@angular/core/testing';

import { CongregacionResolver } from './congregacion.resolver';

describe('CongregacionResolver', () => {
  let resolver: CongregacionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CongregacionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
