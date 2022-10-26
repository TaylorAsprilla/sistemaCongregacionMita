import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DivisaModel } from 'src/app/core/models/divisa.model';
import { PaisModel } from 'src/app/core/models/pais.model';
import { Rutas } from 'src/app/routes/menu-items';
import { PaisService } from 'src/app/services/pais/pais.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css'],
})
export class PaisesComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public paises: PaisModel[] = [];
  public divisas: DivisaModel[] = [];

  // Subscription
  public paisSubscription: Subscription;
  public divisaSubscription: Subscription;

  constructor(private router: Router, private paisService: PaisService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { divisas: DivisaModel[] }) => {
      this.divisas = data.divisas;
    });

    this.cargarPaises();
  }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
  }

  cargarPaises() {
    this.cargando = true;
    this.paisSubscription = this.paisService.getPaises().subscribe((pais: PaisModel[]) => {
      this.paises = pais;
      this.cargando = false;
    });
  }

  borrarPais(pais: PaisModel) {
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
        this.paisService.eliminarPais(pais).subscribe((paisEliminado: PaisModel) => {
          Swal.fire('¡Deshabilitado!', `El país ${pais.pais} fue deshabilitado correctamente`, 'success');

          this.cargarPaises();
        });
      }
    });
  }

  activarPais(pais: PaisModel) {
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
        this.paisService.activarPais(pais).subscribe((paisActivo: PaisModel) => {
          Swal.fire('¡Activado!', `El país ${pais.pais} fue activado correctamente`, 'success');

          this.cargarPaises();
        });
      }
    });
  }

  actualizarPais(id: number) {
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.PAISES}/${id}`);
  }

  crearPais() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.PAISES}/${nuevo}`);
  }

  buscarDivisa(idDivisa: number): string {
    const nombreDivisa = this.divisas.find((divisa) => divisa.id === idDivisa)?.divisa;

    if (nombreDivisa !== undefined) {
      return nombreDivisa;
    } else {
      return 'No tiene divisa asignada';
    }
  }
}
