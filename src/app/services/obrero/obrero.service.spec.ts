import { TestBed } from '@angular/core/testing';

import { ObreroService } from './obrero.service';

describe('ObreroService', () => {
  let service: ObreroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObreroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
