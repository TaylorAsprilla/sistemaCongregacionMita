import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'youtube',
})
export class YoutubePipe implements PipeTransform {
  currentVideoId: string;
  constructor(protected domSanitizer: DomSanitizer) {}

  transform(video: any, args?: any[]): any {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\/)|(\?v=|\&v=))([^#\&\?]*).*/;
    const match = video.match(regExp);

    if (match && match[8].length == 11) {
      this.currentVideoId = match[8];
    } else {
      console.log('Error');
    }

    return this.currentVideoId;
  }
}
