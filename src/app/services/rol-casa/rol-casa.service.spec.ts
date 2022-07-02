import { TestBed } from '@angular/core/testing';

import { RolCasaService } from './rol-casa.service';

describe('RolCasaService', () => {
  let service: RolCasaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolCasaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
