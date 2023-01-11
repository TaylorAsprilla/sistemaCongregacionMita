import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ObjectUnsubscribedError, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EstatusModel } from 'src/app/core/models/estatus.model';
import { MetaModel } from 'src/app/core/models/meta.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { EstatusService } from 'src/app/services/estatus/estatus.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-metas',
  templateUrl: './informe-metas.component.html',
  styleUrls: ['./informe-metas.component.scss'],
})
export class InformeMetasComponent implements OnInit, OnDestroy {
  public metaForm: UntypedFormGroup;

  public estatus: EstatusModel[] = [];

  public metas: MetaModel[] = [];

  public metaSeleccionada: MetaModel;

  // Subscription
  public metaSubscription: Subscription;
  public estatusSubscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private estatusService: EstatusService,
    private metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaForm = this.formBuilder.group({
      meta: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      accion: ['', []],
      comentarios: ['', []],
      informe_id: ['1', [Validators.required]],
      tipoStatus_id: ['', [Validators.required]],
    });

    this.cargarEstatus();
    this.cargarMetas();
  }

  ngOnDestroy(): void {
    this.estatusSubscription?.unsubscribe();
    this.metaSubscription?.unsubscribe();
  }

  cargarEstatus() {
    this.estatusSubscription = this.estatusService.getEstatus().subscribe((estatus) => {
      this.estatus = estatus.filter((estatus: EstatusModel) => estatus.estado === true);
    });
  }

  cargarMetas() {
    this.metaSubscription = this.metaService.getMetas().subscribe((meta: MetaModel[]) => {
      this.metas = meta;
    });
  }

  buscarMeta(id: string) {
    if (id !== 'nuevo') {
      this.metaService
        .getMeta(Number(id))
        .pipe(delay(100))
        .subscribe(
          (metaEncontrada: MetaModel) => {
            const { meta, fecha, accion, tipoStatus_id, comentarios, informe_id } = metaEncontrada;
            this.metaSeleccionada = metaEncontrada;

            this.metaForm.setValue({ meta, fecha, accion, tipoStatus_id, comentarios, informe_id });
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Metas',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.METAS}`);
          }
        );
    }
  }

  guardarMeta() {
    const informeMeta = this.metaForm.value;

    this.metaService.crearMeta(informeMeta).subscribe(
      (metaCreada: any) => {
        Swal.fire('Informe de metas', 'Se registró la meta correctamente', 'success');
        this.navegarAlInforme();
      },
      (error) => {
        let errores = error.error.errors;
        let listaErrores = [];

        Object.entries(errores).forEach(([key, value]) => {
          listaErrores.push('° ' + value['msg'] + '<br>');
        });

        Swal.fire({
          title: 'Informe de metas',
          icon: 'error',
          html: `Error al guardar el informe de metas <p> ${listaErrores.join('')}`,
        });
        this.navegarAlInforme();
      }
    );
  }

  navegarAlInforme() {
    return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INFORME}`);
  }
}
