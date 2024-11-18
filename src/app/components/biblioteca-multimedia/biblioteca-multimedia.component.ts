import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LinkEventoModel, PLATAFORMA, TIPOEVENTO_ID } from 'src/app/core/models/link-evento.model';

@Component({
  selector: 'app-biblioteca-multimedia',
  templateUrl: './biblioteca-multimedia.component.html',
  styleUrls: ['./biblioteca-multimedia.component.scss'],
})
export class BibliotecaMultimediaComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() serviciosYvigilias: LinkEventoModel[] = [];
  @Input() titulo: string = '';
  @Input() tipoDeEvento: TIPOEVENTO_ID | string | undefined;

  @ViewChild('templateYouTubePlayer') templateYouTubePlayer: ElementRef<HTMLDivElement>;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  linkEventos: LinkEventoModel[] = [];

  get PLATAFORMA() {
    return PLATAFORMA;
  }

  get TIPOEVENTO() {
    return TIPOEVENTO_ID;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, public domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  ngAfterViewInit(): void {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  onResize = (): void => {
    // Automatically expand the video to fit the page up to 1200px x 720px
    this.videoWidth = Math.min(this.templateYouTubePlayer?.nativeElement.clientWidth, 1000);
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  };

  domSanitizerVideo(linkVideo: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(linkVideo);
  }
}
