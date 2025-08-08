import { Component, OnInit, inject } from '@angular/core';
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
  private activatedRoute = inject(ActivatedRoute);
  private solicitudMultimediaService = inject(SolicitudMultimediaService);

  solicitudValida: boolean = false;

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
