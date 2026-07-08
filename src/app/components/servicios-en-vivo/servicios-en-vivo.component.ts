import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LinkEventoModel, PLATAFORMAENUM, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';
import { SessionMonitorService } from 'src/app/core/services/session-monitor.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { EventoEnVivoService } from 'src/app/services/evento-en-vivo/evento-en-vivo.service';
import { EventoEnVivo } from 'src/app/core/interfaces/evento-en-vivo.interface';
import { CargandoInformacionComponent } from '../cargando-informacion/cargando-informacion.component';

@Component({
  selector: 'app-servicios-en-vivo',
  templateUrl: './servicios-en-vivo.component.html',
  styleUrls: ['./servicios-en-vivo.component.scss'],
  standalone: true,
  imports: [CommonModule, CargandoInformacionComponent],
})
export class ServiciosEnVivoComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private sessionMonitorService = inject(SessionMonitorService);
  private eventoEnVivoService = inject(EventoEnVivoService);
  domSanitizer = inject(DomSanitizer);

  @ViewChild('templateYouTubePlayer') templateYouTubePlayer: ElementRef<HTMLDivElement>;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  // Nuevo sistema de eventos en vivo
  eventoActual: EventoEnVivo | null = null;
  cargandoEvento: boolean = false;
  errorEvento: string | null = null;

  videoUrl: SafeResourceUrl | undefined;
  servicioPlataforma: string = '';
  titulo: string = '';
  multimediaStreamUrl: SafeResourceUrl | undefined;
  sesionesActivas: number = 0;
  sesionesSubscription: Subscription | null = null;

  readonly PLATAFORMA = PLATAFORMAENUM;
  readonly TIPOEVENTO_ID = TIPOEVENTO_ID;

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // Inicializar URL de multimedia de forma ofuscada
    const parts = [
      'https://multimediastream2.net:5443',
      '/live',
      '/play.html?id=multimedia',
      '&playOrder=hls',
      '&autoplay=true',
      '&mute=false',
    ];
    const streamUrl = parts.join('');
    this.multimediaStreamUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(streamUrl);

    // Cargar último evento en vivo
    this.cargarUltimoEvento();

    // Cargar sesiones activas
    this.cargarSesionesActivas();
  }

  cargarUltimoEvento(): void {
    this.cargandoEvento = true;
    this.errorEvento = null;

    this.eventoEnVivoService.obtenerUltimoEvento().subscribe({
      next: (response) => {
        this.eventoActual = response.ultimoEvento;
        if (this.eventoActual) {
          this.procesarEvento(this.eventoActual);
        }
        this.cargandoEvento = false;
      },
      error: (error) => {
        console.error('Error al cargar evento:', error);
        this.errorEvento = error.error?.msg || 'No hay eventos configurados';
        this.cargandoEvento = false;
      },
    });
  }

  procesarEvento(evento: EventoEnVivo): void {
    this.servicioPlataforma = evento.plataforma;
    this.titulo = evento.titulo;

    if (evento.plataforma === 'youtube') {
      const videoId = this.extractYouTubeVideoId(evento.linkTransmision);
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`,
      );
    } else if (evento.plataforma === 'vimeo') {
      let embedUrl = evento.linkTransmision;

      // Convertir URL de Vimeo Event a formato embed
      // https://vimeo.com/event/5572935 -> https://vimeo.com/event/5572935/embed
      if (embedUrl.includes('vimeo.com/event/') && !embedUrl.includes('/embed')) {
        embedUrl = embedUrl + '/embed';
      }
      // Convertir URL regular de Vimeo a formato embed
      // https://vimeo.com/123456789 -> https://player.vimeo.com/video/123456789
      else if (embedUrl.match(/vimeo\.com\/(\d+)$/)) {
        const videoId = embedUrl.match(/vimeo\.com\/(\d+)$/)?.[1];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }

      // Agregar parámetros de reproducción
      const separator = embedUrl.includes('?') ? '&' : '?';
      embedUrl += `${separator}autoplay=1&title=0&byline=0&portrait=0`;

      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else if (evento.plataforma === 'antmedia') {
      // AntMedia usa directamente el URL proporcionado
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(evento.linkTransmision);
    }
  }

  cargarSesionesActivas(): void {
    // Ejecutar inmediatamente y luego cada 30 segundos
    this.sesionesSubscription = timer(0, 30000) // 0ms inicial, luego cada 30 segundos
      .pipe(switchMap(() => this.sessionMonitorService.getActiveSessions()))
      .subscribe({
        next: (response) => {
          // Usar el campo currentlyActiveSessions del backend
          this.sesionesActivas = response.currentlyActiveSessions || 0;
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.sesionesActivas = 0;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicios'] && changes['servicios'].currentValue) {
      const videos = changes['servicios'].currentValue as LinkEventoModel;
      if (videos.plataforma === PLATAFORMAENUM.VIMEO) {
        // Asegurarse de que sea el link embed
        let embedUrl = videos.link;

        // Si por error te guardaron el link público (https://vimeo.com/event/4874306)
        if (embedUrl.includes('vimeo.com/event/') && !embedUrl.includes('/embed')) {
          embedUrl = embedUrl.replace('vimeo.com/event/', 'vimeo.com/event/') + '/embed';
        }

        // Opcional: agregar parámetros
        embedUrl += '?autoplay=1&title=0&byline=0&portrait=0';

        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      } else if (videos.plataforma === PLATAFORMAENUM.YOUTUBE) {
        const videoId = this.extractYouTubeVideoId(videos.link);

        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1`,
        );
      } else {
        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(videos.link);
      }
      this.servicioPlataforma = videos.plataforma;
      this.titulo = videos.titulo;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.sesionesSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  extractYouTubeVideoId(url: string): string {
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : '';
  }

  onResize = (): void => {
    // Automatically expand the video to fit the page up to 1200px x 720px
    this.videoWidth = Math.min(this.templateYouTubePlayer?.nativeElement.clientWidth, 1000);
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  };

  // Método para prevenir click derecho en el iframe
  onContextMenu(event: MouseEvent): boolean {
    event.preventDefault();
    return false;
  }
}
