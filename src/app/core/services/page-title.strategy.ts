import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from 'environment';

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pagina = this.buildTitle(snapshot);
    const prefijo = environment.production ? '' : 'PRUEBAS · ';
    this.title.setTitle(`${prefijo}${pagina ? `${pagina} | ` : ''}CMAR LIVE`);
  }
}
