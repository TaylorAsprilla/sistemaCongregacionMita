import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RolCasaModel } from 'src/app/core/models/rol-casa.model';
import { RolCasaService } from 'src/app/services/rol-casa/rol-casa.service';
import Swal from 'sweetalert2';

import { CargandoInformacionComponent } from '../../../components/cargando-informacion/cargando-informacion.component';

@Component({
  selector: 'app-rol-en-casa',
  templateUrl: './rol-en-casa.component.html',
  styleUrls: ['./rol-en-casa.component.scss'],
  standalone: true,
  imports: [CargandoInformacionComponent],
})
export class RolEnCasaComponent implements OnInit, OnDestroy {
  private rolCasaService = inject(RolCasaService);

  public cargando: boolean = true;
  public rolesCasa: RolCasaModel[] = [];

  public rolCasaSubscription: Subscription;

  ngOnInit(): void {
    this.cargarRolCasas();
  }

  ngOnDestroy(): void {
    this.rolCasaSubscription?.unsubscribe();
  }

  cargarRolCasas() {
    this.cargando = true;
    this.rolCasaSubscription = this.rolCasaService
      .getRolCasa()
      .pipe(delay(100))
      .subscribe((rolCasa: RolCasaModel[]) => {
        this.rolesCasa = rolCasa;
        this.cargando = false;
      });
  }

  buscarRolCasa(id: number) {
    return this.rolesCasa.find((rolCasa: RolCasaModel) => rolCasa.id === id)?.rolCasa;
  }

  async actualizarRolCasa(id: number) {
    let rolCasa = this.buscarRolCasa(id);
    const { value: rolCasaNombre } = await Swal.fire({
      title: 'Actualizar Rol en Casa',
      input: 'text',
      inputLabel: 'Rol en Casa',
      showCancelButton: true,
      inputValue: rolCasa,
    });
    if (rolCasaNombre) {
      const data = {
        rolCasa: rolCasaNombre,
        id: id,
        estado: true,
      };
      this.rolCasaService.actualizarRolCasa(data).subscribe(
        (rolCasaActivo: RolCasaModel) => {
          Swal.fire('Actualizado!', `El Rol en Casa ${rolCasaNombre.rolCasa} se actualizó correctamente`, 'success');
          this.cargarRolCasas();
        },
        (error) => {
          let errores = error.error;

          Swal.fire({
            title: 'Error al actualizar',
            icon: 'error',
            html: `${errores?.msg}`,
          });
        }
      );
    }
  }

  borrarRolCasa(rolCasa: RolCasaModel) {
    Swal.fire({
      title: '¿Borrar Rol en Casa?',
      text: `Esta seguro de borrar ${rolCasa.rolCasa}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolCasaService.eliminarRolCasa(rolCasa).subscribe((rolCasaEliminado: RolCasaModel) => {
          Swal.fire('¡Deshabilitado!', `El género ${rolCasa.rolCasa} fue deshabilitado correctamente`, 'success');

          this.cargarRolCasas();
        });
      }
    });
  }

  activarRolCasa(rolCasa: RolCasaModel) {
    Swal.fire({
      title: 'Activar Rol en Casa',
      text: `Esta seguro de activar el género ${rolCasa.rolCasa}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolCasaService.activarRolCasa(rolCasa).subscribe((rolCasaActivo: RolCasaModel) => {
          Swal.fire('¡Activado!', `El género ${rolCasa.rolCasa} fue activado correctamente`, 'success');

          this.cargarRolCasas();
        });
      }
    });
  }

  async crearRolCasa() {
    const { value: rolCasa } = await Swal.fire({
      title: 'Nueva Rol en Casa',
      input: 'text',
      inputLabel: 'Rol en Casa',

      showCancelButton: true,
    });

    if (rolCasa) {
      this.rolCasaService.crearRolCasa(rolCasa).subscribe((rolCasaActivo: RolCasaModel) => {
        Swal.fire('Creado!', `El Rol en Casa ${rolCasa.tipoTransporte} fue creado correctamente`, 'success');

        this.cargarRolCasas();
      });
    }
  }
}
