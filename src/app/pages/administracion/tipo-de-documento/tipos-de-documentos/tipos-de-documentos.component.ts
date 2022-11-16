import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoDocumentoModel } from 'src/app/core/models/tipo-documento.model';
import { TipoDocumentoService } from 'src/app/services/tipo-documento/tipo-documento.service';

@Component({
  selector: 'app-tipos-de-documentos',
  templateUrl: './tipos-de-documentos.component.html',
  styleUrls: ['./tipos-de-documentos.component.scss'],
})
export class TiposDeDocumentosComponent implements OnInit {
  public cargando: boolean = true;
  public tipoDeDocumentos: TipoDocumentoModel[] = [];

  // Subscription
  public tipoDeDocumentosSubscription: Subscription;

  constructor(
    private router: Router,
    private tipoDocumentoService: TipoDocumentoService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

  crearTipoDeDocumento() {}

  buscarPais() {}

  actualizarTipoDeDocumento(id: number) {}

  borrarTipoDeDocumento(id: number) {}

  activarTipoDeDocumento(id: number) {}
}
