import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Subscription } from 'rxjs';
import { SeccionInformeModel } from 'src/app/models/seccion-informe.model';
import { InformeService } from 'src/app/services/informe/informe.service';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { TipoActividadModel } from 'src/app/models/tipo-actividad.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { PaisModel } from 'src/app/models/pais.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PaisService } from 'src/app/services/pais/pais.service';

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

  items = [
    { name: 'jean', surname: 'kruger' },
    { name: 'bobby', surname: 'marais' },
  ];

  public usuarios: UsuarioModel[] = [];
  public usuarioSubscription: Subscription;

  public paises: PaisModel[] = [];
  public paisSubscription: Subscription;

  public actividadSubcription: Subscription;
  public tipoActividadSubcription: Subscription;
  public tipoActividades: TipoActividadModel[] = [];

  public cargando: boolean = true;

  // desglosar informacion de informe
  informe: any[];
  actividades: any[];

  // 9 secciones diferentes
  servicios: any[] = [];
  especiales: any[] = [];
  espirituales: any[] = [];
  reuniones: any[] = [];

  aspectoContable: any[];
  asuntoPendiente: any[];
  informacionInforme: any[]; // no se que es esto
  logros: any[];
  metas: any[]; // missing
  situacionVisita: any[];
  visitas: any[];

  public seccionesInformes: SeccionInformeModel[];

  informeSubscription: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private paisService: PaisService,
    private informeService: InformeService,
    private actividadService: ActividadService,
    private tipoActividadService: TipoActividadService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // traer secciones
    this.activatedRoute.data.subscribe((data: { seccionInforme: SeccionInformeModel[] }) => {
      this.seccionesInformes = data.seccionInforme;
      console.log('this.seccionesInformes ', this.seccionesInformes);
    });

    let idInforme = 1;
    this.primerNombre = sessionStorage.getItem('primerNombre');
    this.segundoNombre = sessionStorage.getItem('segundoNombre');
    this.primerApellido = sessionStorage.getItem('primerApellido');
    this.segundApellido = sessionStorage.getItem('segundoApellido');
    this.fechaActual = new Date();

    this.cargarInforme(idInforme);

    this.cargarUsuarios();
    this.cargarPaises();
    this.cargarTipoActividad();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
    this.actividadSubcription?.unsubscribe();
    this.tipoActividadSubcription?.unsubscribe();
  }

  cargarInforme(idInforme) {
    this.informeSubscription = this.informeService.getInforme(idInforme).subscribe((respuesta: any[]) => {
      this.informe = respuesta;
      console.log(this.informe);
      // eliminar y sustituir this.clasificar
      this.actividades = this.informe['actividades'];

      this.aspectoContable = this.informe['aspectoContable'];
      this.asuntoPendiente = this.informe['asuntoPendiente'];
      this.informacionInforme = this.informe['informacioninforme'];
      this.logros = this.informe['logros'];
      this.metas = this.informe['metas'];
      this.situacionVisita = this.informe['situacionVisita'];
      this.visitas = this.informe['visitas'];
      // this.translateActividad();
      this.servicios;
      this.clasificarActividad(this.actividades);
      console.log('test here');
      console.log(this.servicios);
      console.log('test here');
    });
  }

  cargarTipoActividad() {
    this.tipoActividadSubcription = this.tipoActividadService.getTipoActividad().subscribe((nombre) => {
      this.tipoActividades = nombre;
      console.log(this.tipoActividades);
    });
  }

  translateActividad() {
    this.actividades.forEach((actividad) => {
      let id = actividad['tipoActividad_id'];
      console.log(id);
      let nombre = this.getTipoActividadName(id);
      console.log(nombre);
      // sustituir
      actividad['tipoActividad_id'] = nombre;
    });
  }

  clasificarActividad(conjunto) {
    conjunto.forEach((actividad) => {
      //console.log(actividad);
      let idTipoAct = actividad.tipoActividad_id;
      console.log(idTipoAct);
      //tipoAct.seccionID
      let idSec = this.tipoActividades.find((item) => item.id === idTipoAct).idSeccion;

      console.log(idSec);
      // validar que existe seccion de la actividad/tipoActividad/idSeccion
      this.seccionesInformes.forEach((seccion) => {
        if (seccion.id === idSec) {
          console.log('id de seccion existe');
          // colocar array de seccion segun id
          switch (idSec) {
            case 1:
              this.servicios.push(actividad);
              break;
            case 2:
              console.log('aqui iria visitas');
              break;
            case 3:
              console.log('aqui iria situaciones');
              break;
            case 4:
              this.especiales.push(actividad);
              break;
            case 5:
              this.espirituales.push(actividad);
              break;
            case 6:
              this.reuniones.push(actividad);
              break;
            case 7:
              console.log('aqui iria aspectos contables');
              break;
            case 8:
              console.log('aqui iria logros');
              break;
            case 9:
              console.log('aqui iria pendientes');
              break;
            case 10:
              console.log('aqui iria metas');
              break;
          }
        }
      });
    });
  }

  getTipoActividadName(id) {
    console.log('hi');
    try {
      return this.tipoActividades[id]['nombre'];
    } catch (exception_var) {
      ('cant find name with that id');
    }
    return id;
  }

  cargarUsuarios() {
    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios;
    });
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
