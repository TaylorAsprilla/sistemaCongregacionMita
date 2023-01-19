import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TipoEstudioModel } from 'src/app/core/models/tipo-estudio.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { TipoEstudioService } from 'src/app/services/tipo-estudio/tipo-estudio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-de-estudio',
  templateUrl: './tipo-de-estudio.component.html',
  styleUrls: ['./tipo-de-estudio.component.scss'],
})
export class TipoDeEstudioComponent implements OnInit {
  public cargando: boolean = true;
  public tipoEstudios: TipoEstudioModel[] = [];

  public tipoEstudioSubscription: Subscription;

  constructor(
    private router: Router,
    private tipoEstudioService: TipoEstudioService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargartipoEstudios();
  }

  ngOnDestroy(): void {
    this.tipoEstudioSubscription?.unsubscribe();
  }

  cargartipoEstudios() {
    this.cargando = true;
    this.tipoEstudioSubscription = this.tipoEstudioService
      .getTipoEstudio()
      .pipe(delay(100))
      .subscribe((tipoEstudio: TipoEstudioModel[]) => {
        this.tipoEstudios = tipoEstudio;
        this.cargando = false;
      });
  }

  actualizartipoEstudios(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.TIPO_DE_ESTUDIO}/${id}`);
  }

  borrartipoEstudio(tipoEstudio: TipoEstudioModel) {
    Swal.fire({
      title: '¿Borrar Opción de Transporte?',
      text: `Esta seguro de borrar tipo de estudio ${tipoEstudio.estudio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoEstudioService.eliminarTipoEmpleo(tipoEstudio).subscribe((tipoEstudioEliminado: TipoEstudioModel) => {
          Swal.fire(
            '¡Deshabilitado!',
            `El tipo estudio ${tipoEstudio.estudio} fue deshabilitado correctamente`,
            'success'
          );

          this.cargartipoEstudios();
        });
      }
    });
  }

  activartipoEstudio(tipoEstudio: TipoEstudioModel) {
    Swal.fire({
      title: 'Activar Opción',
      text: `Esta seguro de activar la opción ${tipoEstudio.estudio}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoEstudioService.activarTipoEmpleo(tipoEstudio).subscribe((tipoEstudioActiva: TipoEstudioModel) => {
          Swal.fire('¡Activado!', `La opción ${tipoEstudio.estudio} fue activada correctamente`, 'success');

          this.cargartipoEstudios();
        });
      }
    });
  }
}
