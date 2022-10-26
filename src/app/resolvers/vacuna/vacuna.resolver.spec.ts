import { TestBed } from '@angular/core/testing';

import { VacunaResolver } from './vacuna.resolver';

describe('VacunaResolver', () => {
  let resolver: VacunaResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(VacunaResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
