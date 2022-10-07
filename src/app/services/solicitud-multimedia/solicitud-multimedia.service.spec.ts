import { TestBed } from '@angular/core/testing';

import { SolicitudMultimediaService } from './solicitud-multimedia.service';

describe('SolicitudMultimediaService', () => {
  let service: SolicitudMultimediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudMultimediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
