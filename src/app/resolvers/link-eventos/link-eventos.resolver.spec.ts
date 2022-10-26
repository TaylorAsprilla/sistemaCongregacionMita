import { TestBed } from '@angular/core/testing';

import { LinkEventosResolver } from './link-eventos.resolver';

describe('LinkEventosResolver', () => {
  let resolver: LinkEventosResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LinkEventosResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
