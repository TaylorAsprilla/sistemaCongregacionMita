import { TestBed } from '@angular/core/testing';

import { TipoEstudioResolver } from './tipo-estudio.resolver';

describe('TipoEstudioResolver', () => {
  let resolver: TipoEstudioResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TipoEstudioResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
