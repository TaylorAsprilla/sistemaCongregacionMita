import { TestBed } from '@angular/core/testing';

import { InformesResolver } from './informes.resolver';

describe('InformesResolver', () => {
  let resolver: InformesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InformesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
