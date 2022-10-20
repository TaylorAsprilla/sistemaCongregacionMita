import { TestBed } from '@angular/core/testing';

import { GradoAcademicoResolver } from './grado-academico.resolver';

describe('GradoAcademicoResolver', () => {
  let resolver: GradoAcademicoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GradoAcademicoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
