import { TestBed } from '@angular/core/testing';

import { CongregacionService } from './congregacion.service';

describe('CongregacionService', () => {
  let service: CongregacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongregacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
