import { TestBed } from '@angular/core/testing';

import { LinkEventosService } from './link-eventos.service';

describe('LinkEventosService', () => {
  let service: LinkEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
