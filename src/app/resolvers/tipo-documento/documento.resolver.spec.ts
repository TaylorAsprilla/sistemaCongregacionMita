import { TestBed } from '@angular/core/testing';

import { DocumentoResolver } from './documento.resolver';

describe('DocumentoResolver', () => {
  let resolver: DocumentoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DocumentoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
