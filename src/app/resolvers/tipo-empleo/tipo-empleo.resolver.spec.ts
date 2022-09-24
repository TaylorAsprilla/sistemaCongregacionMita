import { TestBed } from '@angular/core/testing';

import { TipoEmpleoResolver } from './tipo-empleo.resolver';

describe('TipoEmpleoResolver', () => {
  let resolver: TipoEmpleoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TipoEmpleoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
