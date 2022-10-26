import { TestBed } from '@angular/core/testing';

import { GradoAcademicoService } from './grado-academico.service';

describe('GradoAcademicoService', () => {
  let service: GradoAcademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradoAcademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
