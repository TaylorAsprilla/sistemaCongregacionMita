import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EstatusModel } from 'src/app/models/estatus.model';
import { MetaModel } from 'src/app/models/meta.model';
import { Rutas } from 'src/app/routes/menu-items';
import { EstatusService } from 'src/app/services/estatus/estatus.service';
import { MetaService } from 'src/app/services/meta/meta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informe-metas',
  templateUrl: './informe-metas.component.html',
  styleUrls: ['./informe-metas.component.scss'],
})
export class InformeMetasComponent implements OnInit, OnDestroy {
  public metaForm: FormGroup;

  public estatus: EstatusModel[] = [];

  // Subscription
  public metaSubscription: Subscription;
  public estatusSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
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

    this.metaSubscription = this.estatusService.getEstatus().subscribe((estatus) => {
      this.estatus = estatus.filter((estatus: EstatusModel) => estatus.estado === true);
    });
  }

  ngOnDestroy(): void {
    this.metaSubscription?.unsubscribe();
  }
  guardarMeta() {
    const informeMeta = this.metaForm.value;

    this.metaService.crearMeta(informeMeta).subscribe(
      (metaCreada: any) => {
        Swal.fire('Informe de metas', 'Se registró la meta correctamente', 'success');
        this.router.navigateByUrl(Rutas.INFORME);
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
        this.router.navigateByUrl(`${Rutas.SISTEMA}/${Rutas.INFORME}`);
      }
    );
  }
}
