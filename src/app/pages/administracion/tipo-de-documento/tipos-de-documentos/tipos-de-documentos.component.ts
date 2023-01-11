import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaisModel } from 'src/app/core/models/pais.model';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-de-documentos',
  templateUrl: './tipos-de-documentos.component.html',
  styleUrls: ['./tipos-de-documentos.component.scss'],
})
export class TiposDeDocumentosComponent implements OnInit {
  public cargando: boolean = true;
  public tipoDeDocumentos: TipoDocumentoModel[] = [];
  public paises: PaisModel[] = [];

  // Subscription
  public tipoDeDocumentosSubscription: Subscription;

  constructor(
    private router: Router,
    private tipoDocumentoService: TipoDocumentoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { pais: PaisModel[] }) => {
      this.paises = data.pais;
    });

    this.cargarTipoDeDocumentos();
  }

  ngOnDestroy(): void {
    this.tipoDeDocumentosSubscription?.unsubscribe();
  }

  cargarTipoDeDocumentos() {
    this.cargando = true;
    this.tipoDeDocumentosSubscription = this.tipoDocumentoService
      .getTiposDeDocumentos()
      .subscribe((tipoDeDocumento: TipoDocumentoModel[]) => {
        this.tipoDeDocumentos = tipoDeDocumento;
        this.cargando = false;
      });
  }

  crearTipoDeDocumento() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.TIPO_DE_DOCUMENTO}/${nuevo}`);
  }

  buscarPais(idPais: number) {
    const nombrePais = this.paises.find((pais) => pais.id === idPais)?.pais;

    if (nombrePais !== undefined) {
      return nombrePais;
    } else {
      return 'No tiene país asignado asignado';
    }
  }

  borrarTipoDeDocumento(tipoDeDocumento: TipoDocumentoModel) {
    Swal.fire({
      title: '¿Borrar Tipo de Documento?',
      text: `Esta seguro de borrar el tipo de documento ${tipoDeDocumento.documento}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoDocumentoService
          .elimiminarTipoDocumento(tipoDeDocumento)
          .subscribe((tipoDeDocumentoEliminado: TipoDocumentoModel) => {
            Swal.fire(
              '¡Deshabilitado!',
              `El tipo de documento ${tipoDeDocumentoEliminado.documento} fue deshabilitado correctamente`,
              'success'
            );

            this.cargarTipoDeDocumentos();
          });
      }
    });
  }

  activarTipoDeDocumento(tipoDocumento: TipoDocumentoModel) {
    Swal.fire({
      title: 'Activar Tipo de Documento',
      text: `Esta seguro de activar el tipo de documento ${tipoDocumento.documento}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoDocumentoService
          .activarTipoDocumento(tipoDocumento)
          .subscribe((tipoDocumentoActivo: TipoDocumentoModel) => {
            Swal.fire(
              '¡Activado!',
              `El tipo de documento ${tipoDocumento.documento} fue activado correctamente`,
              'success'
            );

            this.cargarTipoDeDocumentos();
          });
      }
    });
  }

  actualizarTipoDocumento(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.TIPO_DE_DOCUMENTO}/${id}`);
  }
}
