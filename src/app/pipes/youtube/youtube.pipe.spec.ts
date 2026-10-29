import { YoutubePipe } from './youtube.pipe';
import { TestBed } from '@angular/core/testing';

describe('YoutubePipe', () => {
  it('create an instance', () => {
    const pipe = TestBed.runInInjectionContext(() => new YoutubePipe());
    expect(pipe).toBeTruthy();
  });
});
