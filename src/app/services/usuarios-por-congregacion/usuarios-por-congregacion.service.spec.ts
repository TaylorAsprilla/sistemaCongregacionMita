import { TestBed } from '@angular/core/testing';

import { UsuariosPorCongregacionService } from './usuarios-por-congregacion.service';

describe('UsuariosPorCongregacionService', () => {
  let service: UsuariosPorCongregacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosPorCongregacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
