import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'youtube',
})
export class YoutubePipe implements PipeTransform {
  currentVideoId: string;
  constructor(protected domSanitizer: DomSanitizer) {}

  transform(video: any, args?: any[]): any {
    // let url = value.replace('https://www.youtu.be/', 'https://www.youtube.com/embed/');
    const params = new URL(video).searchParams;
    this.currentVideoId = params.get('v');

    return this.currentVideoId;
  }
}
