import { TestBed } from '@angular/core/testing';

import { CampoResolver } from './campo.resolver';

describe('CampoResolver', () => {
  let resolver: CampoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CampoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
