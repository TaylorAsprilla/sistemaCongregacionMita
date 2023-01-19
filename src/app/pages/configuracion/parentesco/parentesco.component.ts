import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ParentescoModel } from 'src/app/core/models/parentesco.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { ParentescoService } from 'src/app/services/parentesco/parentesco.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parentesco',
  templateUrl: './parentesco.component.html',
  styleUrls: ['./parentesco.component.scss'],
})
export class ParentescoComponent implements OnInit {
  public cargando: boolean = true;
  public parentescos: ParentescoModel[] = [];

  public parentescoSubscription: Subscription;

  constructor(
    private router: Router,
    private parentescoService: ParentescoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarParentescos();
  }

  ngOnDestroy(): void {
    this.parentescoSubscription?.unsubscribe();
  }

  cargarParentescos() {
    this.cargando = true;
    this.parentescoSubscription = this.parentescoService
      .getParentesco()
      .pipe(delay(100))
      .subscribe((parentesco: ParentescoModel[]) => {
        this.parentescos = parentesco;
        this.cargando = false;
      });
  }

  actualizarParentesco(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PARENTESCO}/${id}`);
  }

  borrarParentesco(parentesco: ParentescoModel) {
    Swal.fire({
      title: '¿Borrar Género?',
      text: `Esta seguro de borrar ${parentesco.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parentescoService.eliminarParentesco(parentesco).subscribe((parentescoEliminado: ParentescoModel) => {
          Swal.fire('¡Deshabilitado!', `El género ${parentesco.nombre} fue deshabilitado correctamente`, 'success');

          this.cargarParentescos();
        });
      }
    });
  }

  activarParentesco(parentesco: ParentescoModel) {
    Swal.fire({
      title: 'Activar Opción',
      text: `Esta seguro de activar el género ${parentesco.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parentescoService.activarParentesco(parentesco).subscribe((parentescoActivo: ParentescoModel) => {
          Swal.fire('¡Activado!', `El género ${parentesco.nombre} fue activado correctamente`, 'success');

          this.cargarParentescos();
        });
      }
    });
  }
}
