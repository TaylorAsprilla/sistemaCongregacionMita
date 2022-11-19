import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'vimeoUrlPipe',
})
export class VimeoUrlPipePipe implements PipeTransform {
  constructor(protected domSanitizer: DomSanitizer) {}

  transform(value: any, args?: any[]): any {
    let url = value.replace('vimeo.com/', 'player.vimeo.com/video/');
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
