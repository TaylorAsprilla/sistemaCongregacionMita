import { TestBed } from '@angular/core/testing';

import { GemelosService } from './gemelos.service';

describe('GemelosService', () => {
  let service: GemelosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GemelosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
