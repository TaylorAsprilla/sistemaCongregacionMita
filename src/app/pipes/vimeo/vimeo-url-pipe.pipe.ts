import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'vimeoUrlPipe',
  standalone: true,
})
export class VimeoUrlPipePipe implements PipeTransform {
  protected domSanitizer = inject(DomSanitizer);

  transform(value: any, args?: any[]): any {
    let url = value.replace('vimeo.com/', 'player.vimeo.com/video/');
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
