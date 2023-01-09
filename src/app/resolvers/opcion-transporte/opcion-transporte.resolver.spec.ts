import { TestBed } from '@angular/core/testing';

import { OpcionTransporteResolver } from './opcion-transporte.resolver';

describe('OpcionTransporteResolver', () => {
  let resolver: OpcionTransporteResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OpcionTransporteResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
