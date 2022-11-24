import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkEventoModel, PLATAFORMA } from 'src/app/core/models/link-evento.model';
import { SeccionInformeModel } from 'src/app/core/models/seccion-informe.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-servicios-y-vigilias',
  templateUrl: './servicios-y-vigilias.component.html',
  styleUrls: ['./servicios-y-vigilias.component.scss'],
})
export class ServiciosYVigiliasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('templateYouTubePlayer') templateYouTubePlayer: ElementRef<HTMLDivElement>;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  linkEventos: LinkEventoModel[] = [];
  servicio: LinkEventoModel;
  vigilia: LinkEventoModel;
  youtube: string = 'youtube';
  vimeo: string = 'vimeo';
  currentVideoId: string;

  get PLATAFORMA() {
    return PLATAFORMA;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { linkEventos: LinkEventoModel[] }) => {
      this.linkEventos = data.linkEventos;
    });

    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.servicio = this.linkEventos.filter((eventos) => eventos.tipoEvento_id === 1)[0];
    this.vigilia = this.linkEventos.filter((eventos) => eventos.tipoEvento_id === 2)[0];
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
    this.videoWidth = Math.min(this.templateYouTubePlayer.nativeElement.clientWidth, 1000);
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  };
}
