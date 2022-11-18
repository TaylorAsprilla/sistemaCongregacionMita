import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen/imagen.pipe';
import { VimeoUrlPipePipe } from './vimeo/vimeo-url-pipe.pipe';

@NgModule({
  declarations: [ImagenPipe, VimeoUrlPipePipe],
  imports: [CommonModule],
  exports: [ImagenPipe, VimeoUrlPipePipe],
})
export class PipesModule {}
