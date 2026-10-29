import { VimeoUrlPipePipe } from './vimeo-url-pipe.pipe';
import { TestBed } from '@angular/core/testing';

describe('VimeoUrlPipePipe', () => {
  it('create an instance', () => {
    const pipe = TestBed.runInInjectionContext(() => new VimeoUrlPipePipe());
    expect(pipe).toBeTruthy();
  });
});
