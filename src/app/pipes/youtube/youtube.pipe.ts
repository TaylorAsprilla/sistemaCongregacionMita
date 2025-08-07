import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'youtube',
    standalone: true,
})
export class YoutubePipe implements PipeTransform {
  protected domSanitizer = inject(DomSanitizer);

  currentVideoId: string = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  transform(video: any, args?: any[]): any {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\/)|(\?v=|\&v=))([^#\&\?]*).*/;
    const match = video.match(regExp);

    if (match && match[8].length == 11) {
      this.currentVideoId = match[8];
    } else {
      console.error('Error');
    }

    return this.currentVideoId;
  }
}
