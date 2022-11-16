import { TestBed } from '@angular/core/testing';

import { PermisosResolver } from './permisos.resolver';

describe('PermisosResolver', () => {
  let resolver: PermisosResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PermisosResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
