import { TestBed } from '@angular/core/testing';

import { ParentescoResolver } from './parentesco.resolver';

describe('ParentescoResolver', () => {
  let resolver: ParentescoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ParentescoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
