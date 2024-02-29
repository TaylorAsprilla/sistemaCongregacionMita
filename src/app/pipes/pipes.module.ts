import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen/imagen.pipe';
import { VimeoUrlPipePipe } from './vimeo/vimeo-url-pipe.pipe';
import { YoutubePipe } from './youtube/youtube.pipe';
import { FilterByNombrePipePipe } from './FilterByNombrePipe/filter-by-nombre-pipe.pipe';
import { TelegramPipe } from './telegram/telegram.pipe';
import { WhatsappPipe } from './whatsapp/whatsapp.pipe';
import { CalcularEdadPipe } from './calcularEdad/calcular-edad.pipe';

@NgModule({
  declarations: [
    ImagenPipe,
    VimeoUrlPipePipe,
    YoutubePipe,
    FilterByNombrePipePipe,
    TelegramPipe,
    WhatsappPipe,
    CalcularEdadPipe,
  ],
  imports: [CommonModule],
  exports: [
    ImagenPipe,
    VimeoUrlPipePipe,
    YoutubePipe,
    FilterByNombrePipePipe,
    TelegramPipe,
    WhatsappPipe,
    CalcularEdadPipe,
  ],
  providers: [FilterByNombrePipePipe],
})
export class PipesModule {}
