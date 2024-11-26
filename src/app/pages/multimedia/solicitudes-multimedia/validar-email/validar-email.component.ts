import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudMultimediaService } from 'src/app/services/solicitud-multimedia/solicitud-multimedia.service';


@Component({
    selector: 'app-validar-email',
    templateUrl: './validar-email.component.html',
    styleUrls: ['./validar-email.component.scss'],
    standalone: true,
    imports: [],
})
export class ValidarEmailComponent implements OnInit {
  solicitudValida: boolean = false;
  email: string = 'multimedia@congregacionmita.com';

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
