import { TestBed } from '@angular/core/testing';

import { VoluntariadoResolver } from './voluntariado.resolver';

describe('VoluntariadoResolver', () => {
  let resolver: VoluntariadoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(VoluntariadoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
