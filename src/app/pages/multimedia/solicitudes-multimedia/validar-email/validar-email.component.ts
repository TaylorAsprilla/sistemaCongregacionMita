import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';

@Component({
  selector: 'app-validar-email',
  templateUrl: './validar-email.component.html',
  styleUrls: ['./validar-email.component.scss'],
})
export class ValidarEmailComponent implements OnInit {
  public solicitudValida: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private solicitudMultimediaService: SolicitudMultimediaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.activarSolicitud(id);
    });
  }

  activarSolicitud(id: number) {
    this.solicitudMultimediaService.validarEmail(id).subscribe((respuesta: any) => {
      this.solicitudValida = true;
    });
  }
}
