import { TestBed } from '@angular/core/testing';

import { TipoMiembroResolver } from './tipo-miembro.resolver';

describe('TipoMiembroResolver', () => {
  let resolver: TipoMiembroResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TipoMiembroResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
