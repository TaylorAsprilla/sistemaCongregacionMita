import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OpcionTransporteModel } from 'src/app/core/models/opcion-transporte.model';
import { OpcionTransporteService } from 'src/app/services/opcion-transporte/opcion-transporte.service';
import { RUTAS } from 'src/app/routes/menu-items';
import Swal from 'sweetalert2';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-opcion-de-transporte',
  templateUrl: './opcion-de-transporte.component.html',
  styleUrls: ['./opcion-de-transporte.component.scss'],
})
export class OpcionDeTransporteComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;
  public opcionesTransporte: OpcionTransporteModel[] = [];

  public opcionTransporteSubscription: Subscription;

  private formBuilder: FormBuilder;

  constructor(
    private router: Router,
    private opcionTransporteService: OpcionTransporteService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarOpciones();
  }

  ngOnDestroy(): void {
    this.opcionTransporteSubscription?.unsubscribe();
  }

  cargarOpciones() {
    this.cargando = true;
    this.opcionTransporteSubscription = this.opcionTransporteService
      .getOpcionTransporte()
      .pipe(delay(100))
      .subscribe((opcionTransporte: OpcionTransporteModel[]) => {
        this.opcionesTransporte = opcionTransporte;
        this.cargando = false;
      });
  }

  async buscarOpcion(id: number) {
    let tipoTransporte = '';
    if (id) {
      await this.opcionTransporteService
        .getUnaOpcionTransporte(Number(id))
        .pipe(delay(100))
        .subscribe(
          (opcionEncontrada: OpcionTransporteModel) => {
            //const { tipoTransporte } = opcionEncontrada;
            //this.paisSeleccionado = paisEncontrado;

            //opcionForm.setValue({ tipoTransporte });
            tipoTransporte = opcionEncontrada.tipoTransporte;
            console.log('encontrada ' + tipoTransporte);
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Congregacion',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            //return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.PAISES}`);
          }
        );
    }
    console.log('hola' + tipoTransporte);
    return tipoTransporte;
  }

  async actualizarOpciones(id: number) {
    let opt = await this.buscarOpcion(id);
    console.log('soy opt ' + opt);
    const { value: opcion } = await Swal.fire({
      title: 'Actualizar opción',
      input: 'text',
      inputLabel: 'Opción',
      // inputValue: inputValue,
      showCancelButton: true,
      inputPlaceholder: opt,
      // inputValidator: (value) => {
      //   if (!value) {
      //     return 'You need to write something!';
      //   }
      // },
    });

    if (opcion) {
      const data = {
        tipoTransporte: opcion,
        id: 6,
        estado: true,
      };
      this.opcionTransporteService.crearTipoEstudio(data).subscribe((opcionActiva: OpcionTransporteModel) => {
        Swal.fire('Creada!', `La opción ${opcion.tipoTransporte} fue creada correctamente`, 'success');

        this.cargarOpciones();
      });
      Swal.fire(`${opcion} creada!`);
    }
  }

  borrarOpcion(opcion: OpcionTransporteModel) {
    Swal.fire({
      title: '¿Borrar Opción de Transporte?',
      text: `Esta seguro de borrar la opción ${opcion.tipoTransporte}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.opcionTransporteService.eliminarOpcion(opcion).subscribe((opcionEliminada: OpcionTransporteModel) => {
          Swal.fire('¡Deshabilitado!', `La opción ${opcion.tipoTransporte} fue deshabilitado correctamente`, 'success');
          console.log(opcion);
          this.cargarOpciones();
        });
      }
    });
  }

  activarOpcion(opcion: OpcionTransporteModel) {
    Swal.fire({
      title: 'Activar Opción',
      text: `Esta seguro de activar la opción ${opcion.tipoTransporte}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.opcionTransporteService.activarTipoEmpleo(opcion).subscribe((opcionActiva: OpcionTransporteModel) => {
          Swal.fire('¡Activado!', `La opción ${opcion.tipoTransporte} fue activada correctamente`, 'success');

          this.cargarOpciones();
        });
      }
    });
  }

  async crearOpcion() {
    // const ipAPI = '//api.ipify.org?format=json';

    // const inputValue = fetch(ipAPI)
    //   .then((response) => response.json())
    //   .then((data) => data.ip);

    const { value: opcion } = await Swal.fire({
      title: 'Nueva opción',
      input: 'text',
      inputLabel: 'Opción',
      // inputValue: inputValue,
      showCancelButton: true,
      // inputValidator: (value) => {
      //   if (!value) {
      //     return 'You need to write something!';
      //   }
      // },
    });

    if (opcion) {
      const data = {
        tipoTransporte: opcion,
        id: 6,
        estado: true,
      };
      this.opcionTransporteService.crearTipoEstudio(data).subscribe((opcionActiva: OpcionTransporteModel) => {
        Swal.fire('Creada!', `La opción ${opcion.tipoTransporte} fue creada correctamente`, 'success');

        this.cargarOpciones();
      });
      Swal.fire(`${opcion} creada!`);
    }
  }
}
