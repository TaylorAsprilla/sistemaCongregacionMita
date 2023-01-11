import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-congregaciones',
  templateUrl: './congregaciones.component.html',
  styleUrls: ['./congregaciones.component.css'],
})
export class CongregacionesComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public congregaciones: CongregacionModel[] = [];
  public obreros: UsuarioModel[] = [];
  public paises: PaisModel[] = [];

  // Subscription
  public congregacionSubscription: Subscription;

  constructor(
    private router: Router,
    private congregacionService: CongregacionService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { obrero: UsuarioModel[]; pais: PaisModel[] }) => {
      this.obreros = data.obrero;
      this.paises = data.pais;
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.congregacionSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .pipe(delay(100))
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.cargando = false;
      });
  }

  borrarCongregacion(congregacion: CongregacionModel) {
    Swal.fire({
      title: '¿Borrar Congregación?',
      text: `Esta seguro de borrar la congregación de ${congregacion.congregacion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.congregacionService.eliminarCongregacion(congregacion).subscribe((congregacionEliminado) => {
          Swal.fire(
            '¡Deshabilitado!',
            `La congregación ${congregacion.congregacion} fue deshabilitada correctamente`,
            'success'
          );

          this.cargarCongregaciones();
        });
      }
    });
  }

  activarCongregacion(congregacion: CongregacionModel) {
    Swal.fire({
      title: 'Activar Congregación',
      text: `Esta seguro de activar la congregación de ${congregacion.congregacion}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.congregacionService.activarCongregacion(congregacion).subscribe((congregacionActiva) => {
          Swal.fire('¡Activado!', `La congregación ${congregacion.congregacion} fue activada correctamente`, 'success');

          this.cargarCongregaciones();
        });
      }
    });
  }

  actualizarCongregacion(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONGREGACIONES}/${id}`);
  }

  crearCongregacion() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.CONGREGACIONES}/${nuevo}`);
  }

  buscarObrero(idObrero: number): string {
    let obrero = this.obreros.find((obrero) => obrero.id === idObrero);

    const nombreObrero = obrero
      ? obrero?.primerNombre +
        ' ' +
        obrero?.segundoNombre +
        ' ' +
        obrero?.primerApellido +
        ' ' +
        obrero?.segundoApellido
      : 'Sin obrero Asignado';

    return nombreObrero;
  }

  buscarPais(idPais: number): string {
    return this.paises.find((pais) => pais.id === idPais)?.pais;
  }
}
