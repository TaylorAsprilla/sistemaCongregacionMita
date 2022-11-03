import { TestBed } from '@angular/core/testing';

import { ObreroResolver } from './obrero.resolver';

describe('ObreroResolver', () => {
  let resolver: ObreroResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ObreroResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
