import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Subscription } from 'rxjs';
import { PaisModel } from 'src/app/models/pais.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { InformeService } from 'src/app/services/informe/informe.service';

@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.css'],
})
export class VerInformeComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) el!: ElementRef;

  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundApellido: string;
  fechaActual: Date;
  trimestre: string;
  public fechaSeleccionada = '';
  public obreroSeleccionado = Object;
  public paisSeleccionado: string;

  items = [1, 2, 3];

  public usuarios: UsuarioModel[] = [];
  public usuarioSubscription: Subscription;

  public paises: PaisModel[] = [];
  public paisSubscription: Subscription;

  public cargando: boolean = true;

  informe: any[];

  informeSubscription: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private paisService: PaisService,
    private informeService: InformeService
  ) {}

  ngOnInit(): void {
    let idInforme = 1;
    this.primerNombre = sessionStorage.getItem('primerNombre');
    this.segundoNombre = sessionStorage.getItem('segundoNombre');
    this.primerApellido = sessionStorage.getItem('primerApellido');
    this.segundApellido = sessionStorage.getItem('segundoApellido');
    this.fechaActual = new Date();

    this.informeSubscription = this.informeService.getInforme(idInforme).subscribe((respuesta: any[]) => {
      this.informe = respuesta;
      console.log(this.informe);
    });
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
  }

  cargarUsuarios() {
    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });

    // this.usuarioServices.listarUsuarios(this.paginaDesde).subscribe(({ totalUsuarios, usuarios }) => {
    //   this.totalUsuarios = totalUsuarios;
    //   this.usuarios = usuarios;
    //   this.usuariosTemporales = usuarios;
    //   this.cargando = false;
    //   this.totalPaginas = Math.ceil(totalUsuarios / 5);
    // });
  }

  cargarPaises() {
    this.paisSubscription = this.paisService.getPaises().subscribe((pais) => {
      this.paises = pais.filter((pais: PaisModel) => pais.estado === true);
    });
  }

  seleccionarObrero(obreroSeleccionado) {
    this.obreroSeleccionado = obreroSeleccionado;
    let paisNum = obreroSeleccionado['pais_id'];
    let paisObject = this.paises.filter((pais: PaisModel) => pais.id === paisNum)[0];
    this.paisSeleccionado = paisObject['pais'];
  }

  seleccionarTrimestre() {
    let fecha = this.fechaSeleccionada.slice(5, 7);
    let mes = parseInt(fecha);

    if (mes >= 1 && mes <= 3) {
      this.trimestre = 'enero, febrero y marzo';
    }
    if (mes >= 4 && mes <= 6) {
      this.trimestre = 'abril, mayo y junio';
    }
    if (mes >= 7 && mes <= 9) {
      this.trimestre = 'julio, agosto y septiembre';
    }
    if (mes >= 10 && mes <= 12) {
      this.trimestre = 'octubre, noviembre y diciembre';
    }
  }

  makePDF() {
    let pdf = new jsPDF('p', 'pt', 'a4');
    let pWidth = pdf.internal.pageSize.width; // 595.28 is the width of a4
    let srcWidth = document.getElementById('content').scrollWidth;
    let margin = 18; // narrow margin - 1.27 cm (36);
    let scale = (pWidth - margin * 2) / srcWidth;
    // pdf.setFont('Times');
    //pdf.addFont('ArialMS', 'Arial', 'normal');

    // pdf.html(this.el.nativeElement, {
    //   callback: (pdf) => {
    //     // texto insertado
    //     pdf.text(fechaSeleccionada, 25, 25);
    //     pdf.text(obreroSeleccionado, 25, 35);

    //     pdf.save('informe.pdf');
    //   },
    // });
    pdf.html(document.getElementById('content'), {
      x: margin,
      y: margin,
      html2canvas: {
        // insert html2canvas options here, e.g.
        scale: scale,
      },
      callback: function () {
        window.open(pdf.output('bloburl'));
      },
    });
  }
}
