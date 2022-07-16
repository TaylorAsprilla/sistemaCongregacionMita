import { TestBed } from '@angular/core/testing';

import { TipoDocumentoResolver } from './tipo-documento.resolver';

describe('TipoDocumentoResolver', () => {
  let resolver: TipoDocumentoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TipoDocumentoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
