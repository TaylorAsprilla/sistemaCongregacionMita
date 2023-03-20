import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DivisaModel } from 'src/app/core/models/divisa.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css'],
})
export class PaisesComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public paises: CongregacionPaisModel[] = [];
  public divisas: DivisaModel[] = [];
  public obreros: UsuarioModel[] = [];

  // Subscription
  public paisSubscription: Subscription;

  constructor(private router: Router, private paisService: PaisService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { divisas: DivisaModel[]; obrero: UsuarioModel[] }) => {
      this.divisas = data.divisas;
      this.obreros = data.obrero;
    });

    this.cargarPaises();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
  }

  cargarPaises() {
    this.cargando = true;
    this.paisSubscription = this.paisService
      .getPaises()
      .pipe(delay(100))
      .subscribe((pais: CongregacionPaisModel[]) => {
        this.paises = pais;
        this.cargando = false;
      });
  }

  borrarPais(pais: CongregacionPaisModel) {
    Swal.fire({
      title: '¿Borrar País?',
      text: `Esta seguro de borrar el país ${pais.pais}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paisService.eliminarPais(pais).subscribe((paisEliminado: CongregacionPaisModel) => {
          Swal.fire('¡Deshabilitado!', `El país ${pais.pais} fue deshabilitado correctamente`, 'success');

          this.cargarPaises();
        });
      }
    });
  }

  activarPais(pais: CongregacionPaisModel) {
    Swal.fire({
      title: 'Activar País',
      text: `Esta seguro de activar el país ${pais.pais}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paisService.activarPais(pais).subscribe((paisActivo: CongregacionPaisModel) => {
          Swal.fire('¡Activado!', `El país ${pais.pais} fue activado correctamente`, 'success');

          this.cargarPaises();
        });
      }
    });
  }

  actualizarPais(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}/${id}`);
  }

  crearPais() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}/${nuevo}`);
  }

  buscarDivisa(idDivisa: number): string {
    const nombreDivisa = this.divisas.find((divisa) => divisa.id === idDivisa)?.divisa;

    if (nombreDivisa !== undefined) {
      return nombreDivisa;
    } else {
      return 'No tiene divisa asignada';
    }
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
}
