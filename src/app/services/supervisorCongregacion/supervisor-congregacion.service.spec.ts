import { TestBed } from '@angular/core/testing';

import { SupervisorCongregacionService } from './supervisor-congregacion.service';

describe('SupervisorCongregacionService', () => {
  let service: SupervisorCongregacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupervisorCongregacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
