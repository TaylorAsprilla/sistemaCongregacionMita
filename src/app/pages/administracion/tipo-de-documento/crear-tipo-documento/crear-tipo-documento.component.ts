import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaisModel } from 'src/app/core/models/pais.model';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-tipo-documento',
  templateUrl: './crear-tipo-documento.component.html',
  styleUrls: ['./crear-tipo-documento.component.scss'],
})
export class CrearTipoDocumentoComponent implements OnInit, OnDestroy {
  public tipoDocumentoForm: FormGroup;
  public paises: PaisModel[] = [];
  public tiposDeDocumentos: TipoDocumentoModel[] = [];
  public tipoDeDocumentoSeleccionado: TipoDocumentoModel;

  public tipoDeDocumentoSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tipoDocumentoService: TipoDocumentoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { pais: PaisModel[] }) => {
      this.paises = data.pais;
    });

    this.tipoDocumentoForm = this.formBuilder.group({
      documento: ['', [Validators.required, Validators.minLength(3)]],
      pais_id: ['', [Validators.required]],
    });

    this.cargarTiposDeDocumentos();
  }

  ngOnDestroy(): void {
    this.tipoDeDocumentoSubscription?.unsubscribe();
  }

  cargarTiposDeDocumentos() {
    this.tipoDeDocumentoSubscription = this.tipoDocumentoService
      .getTiposDeDocumentos()
      .subscribe((tipoDeDocumento: TipoDocumentoModel[]) => {
        this.tiposDeDocumentos = tipoDeDocumento;
      });
  }

  crearTipoDeDocumento() {
    const tipoDeDocumentoNuevo = this.tipoDocumentoForm.value;

    if (this.tipoDeDocumentoSeleccionado) {
      const data = {
        ...this.tipoDocumentoForm.value,
        id: this.tipoDeDocumentoSeleccionado.id,
      };

      this.tipoDocumentoService.actualizarTipoDocumento(data).subscribe((tipoDocumento: any) => {
        Swal.fire({
          title: 'Tipo de Documento Actualizado',
          icon: 'success',
          html: `El tipo de documento ${tipoDocumento.tipoDocumentoActualizado.documento} se actualizó correctamente`,
        });
      });
      this.resetFormulario();
      this.cargarTiposDeDocumentos();
    } else {
      this.tipoDocumentoService.crearTipoDocumento(tipoDeDocumentoNuevo).subscribe(
        (tipoDedocumento: any) => {
          Swal.fire('Tipo de documento creado', `${tipoDedocumento.tipoDocumentoCreado.documento}`, 'success');
          this.resetFormulario();
          this.cargarTiposDeDocumentos();
        },
        (error) => {
          let errores = error.error.errors;
          let listaErrores = [];

          Object.entries(errores).forEach(([key, value]) => {
            listaErrores.push('° ' + value['msg'] + '<br>');
          });

          Swal.fire({
            title: 'Error al crear el tipo de documento',
            icon: 'error',
            html: `${listaErrores.join('')}`,
          });
          this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.TIPO_DE_DOCUMENTO}`);
        }
      );
    }
  }

  buscarTipoDeDocumento(id: string) {
    if (id !== 'nuevo') {
      this.tipoDocumentoService
        .getTipoDocumento(id)
        .pipe(delay(100))
        .subscribe(
          (tipoDeDocumentoEncontrado: TipoDocumentoModel) => {
            const { documento, pais_id } = tipoDeDocumentoEncontrado;
            this.tipoDeDocumentoSeleccionado = tipoDeDocumentoEncontrado;

            this.tipoDocumentoForm.setValue({ documento, pais_id });
          },
          (error) => {
            let errores = error.error.errors;
            let listaErrores = [];

            Object.entries(errores).forEach(([key, value]) => {
              listaErrores.push('° ' + value['msg'] + '<br>');
            });

            Swal.fire({
              title: 'Tipo de Documento',
              icon: 'error',
              html: `${listaErrores.join('')}`,
            });

            return this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.TIPO_DE_DOCUMENTO}`);
          }
        );
    }
  }

  resetFormulario() {
    this.tipoDocumentoForm.reset();
  }
}
