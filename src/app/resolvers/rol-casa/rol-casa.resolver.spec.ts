import { TestBed } from '@angular/core/testing';

import { RolCasaResolver } from './rol-casa.resolver';

describe('RolCasaResolver', () => {
  let resolver: RolCasaResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RolCasaResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
