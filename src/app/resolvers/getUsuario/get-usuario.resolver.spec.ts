import { TestBed } from '@angular/core/testing';

import { GetUsuarioResolver } from './get-usuario.resolver';

describe('GetUsuarioResolver', () => {
  let resolver: GetUsuarioResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetUsuarioResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
