import { TestBed } from '@angular/core/testing';

import { SeccionInformeService } from './seccion-informe.service';

describe('SeccionInformeService', () => {
  let service: SeccionInformeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeccionInformeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
