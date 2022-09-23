import { TestBed } from '@angular/core/testing';

import { AccesoMultimediaService } from './acceso-multimedia.service';

describe('AccesoMultimediaService', () => {
  let service: AccesoMultimediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesoMultimediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
