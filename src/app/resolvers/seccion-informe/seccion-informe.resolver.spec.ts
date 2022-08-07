import { TestBed } from '@angular/core/testing';

import { SeccionInformeResolver } from './seccion-informe.resolver';

describe('SeccionInformeResolver', () => {
  let resolver: SeccionInformeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SeccionInformeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
