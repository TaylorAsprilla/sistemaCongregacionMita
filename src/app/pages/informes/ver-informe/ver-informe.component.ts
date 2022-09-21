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
import { UsuarioInterface } from 'src/app/interfaces/usuario.interface';
import { UsuarioCongregacionModel } from 'src/app/models/usuarioCongregacion.model';
import { data } from 'jquery';
import { ContabilidadModel } from 'src/app/models/contabilidad.model';
import { VisitaModel } from 'src/app/models/visita.model';
import { SituacionVisitaModel } from 'src/app/models/situacion-visita.model';
import { AsuntoPendienteModel } from 'src/app/models/asunto-pendiente.model';
import { LogroModel } from 'src/app/models/logro.model';
import { MetaModel } from 'src/app/models/meta.model';
import { ActividadModel } from 'src/app/models/actividad.model';
import { InformeModel } from 'src/app/models/informe.model';

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
  fraccion: string;
  idInforme = 1;
  public fechaSeleccionada = '';
  public obreroSeleccionado: UsuarioModel;
  public paisObrero: string;

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
  informe: InformeModel[];
  actividades: ActividadModel[];

  servicios: ActividadModel[] = [];
  especiales: ActividadModel[] = [];
  espirituales: ActividadModel[] = [];
  reuniones: ActividadModel[] = [];

  aspectoContable: ContabilidadModel[] = [];
  asuntoPendiente: AsuntoPendienteModel[] = [];
  informacionInforme: InformeModel[];
  logros: LogroModel[] = [];
  metas: MetaModel[] = [];
  situacionVisita: SituacionVisitaModel[] = [];
  visitas: VisitaModel[] = [];

  dataVisitas: VisitaModel[] = [];
  dataSituacionVisitas: SituacionVisitaModel[] = [];
  dataLogros: LogroModel[] = [];
  dataMetas: MetaModel[] = [];
  dataAspectoContable: ContabilidadModel[] = [];
  dataAsuntoPendiente: AsuntoPendienteModel[] = [];

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
    });

    this.primerNombre = sessionStorage.getItem('primerNombre');
    this.segundoNombre = sessionStorage.getItem('segundoNombre');
    this.primerApellido = sessionStorage.getItem('primerApellido');
    this.segundApellido = sessionStorage.getItem('segundoApellido');
    this.fechaActual = new Date();

    this.filtrarInformacionInforme();
    this.cargarUsuarios();
    this.cargarPaises();
    this.cargarTipoActividad();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
    this.actividadSubcription?.unsubscribe();
    this.tipoActividadSubcription?.unsubscribe();
    this.informeSubscription?.unsubscribe();
  }

  cargarInforme(idInforme) {
    this.informeSubscription = this.informeService.getInforme(idInforme).subscribe((respuesta: any[]) => {
      this.informe = respuesta;
      this.actividades = this.informe['actividades'];
      /// data var
      this.informacionInforme = this.informe['informacioninforme'];

      this.dataVisitas = this.informe['visitas'];
      this.dataSituacionVisitas = this.informe['situacionVisita'];
      this.dataLogros = this.informe['logros'];
      this.dataMetas = this.informe['metas'];
      this.dataAspectoContable = this.informe['aspectoContable'];
      this.dataAsuntoPendiente = this.informe['asuntoPendiente'];
    });
    return true;
  }

  cargarTipoActividad() {
    this.tipoActividadSubcription = this.tipoActividadService.getTipoActividad().subscribe((nombre) => {
      this.tipoActividades = nombre;
    });
  }

  clasificarActividad(conjunto) {
    if (conjunto) {
      conjunto.forEach((actividad) => {
        let idTipoAct = actividad.tipoActividad_id;
        let idSec = this.tipoActividades.find((item) => item.id === idTipoAct).idSeccion;
        // validar que existe seccion de la actividad/tipoActividad/idSeccion
        this.seccionesInformes.forEach((seccion) => {
          if (seccion.id === idSec) {
            // colocar array de seccion segun id
            switch (idSec) {
              case 1:
                this.servicios.push(actividad);
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
            }
          }
        });
      });
    }
  }

  filtrarFecha(conjunto) {
    let result: any[] = [];
    let yearSelect = this.fechaSeleccionada.slice(0, 4);
    let monthSelect = this.fechaSeleccionada.slice(5, 7);
    let monthSelectNum = Number(monthSelect);
    let daySelect = this.fechaSeleccionada.slice(8, 10);
    conjunto.forEach((actividad) => {
      let fecha = actividad.fecha;
      let year = fecha.slice(0, 4);
      let month = fecha.slice(5, 7);
      let monthNum = Number(month);
      let day = fecha.slice(8, 10);
      if (yearSelect == year) {
        if (monthSelectNum >= monthNum && monthSelectNum <= monthNum) {
          result.push(actividad);
        }
      }
    });
    return result;
  }

  filtrarFechaCreatedAt(conjunto) {
    let result: any[] = [];
    let yearSelect = this.fechaSeleccionada.slice(0, 4);
    let monthSelect = this.fechaSeleccionada.slice(5, 7);
    let monthSelectNum = Number(monthSelect);
    conjunto.forEach((actividad) => {
      let fecha = actividad.createdAt;
      let year = fecha.slice(0, 4);
      let month = fecha.slice(5, 7);
      let monthNum = Number(month);
      if (yearSelect == year) {
        if (monthSelectNum >= monthNum && monthSelectNum <= monthNum) {
          result.push(actividad);
        }
      }
    });
    return result;
  }

  filtrarCongre(conjunto) {}

  getTipoActividadName(id) {
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

  seleccionarObrero(obreroSeleccionado: UsuarioModel) {
    let obreroInforme: UsuarioCongregacionModel;

    this.usuarioService.getUsuario(obreroSeleccionado.id).subscribe((obrero: UsuarioInterface) => {
      obreroInforme = obrero.usuarioCongregacion;

      this.paisObrero = this.paises.find((pais: PaisModel) => pais.id === obreroInforme?.pais_id)?.pais;
    });
  }

  seleccionarTrimestre() {
    let fecha = this.fechaSeleccionada.slice(5, 7);
    let mes = parseInt(fecha);

    if (mes >= 1 && mes <= 3) {
      this.trimestre = 'enero, febrero y marzo';
      this.fraccion = '1er Trimestre del año';
    }
    if (mes >= 4 && mes <= 6) {
      this.trimestre = 'abril, mayo y junio';
      this.fraccion = '2do Trimestre del año';
    }
    if (mes >= 7 && mes <= 9) {
      this.trimestre = 'julio, agosto y septiembre';
      this.fraccion = '3er Trimestre del año';
    }
    if (mes >= 10 && mes <= 12) {
      this.trimestre = 'octubre, noviembre y diciembre';
      this.fraccion = '4to Trimestre del año';
    }
    this.filtrarInformacionInforme();
  }

  filtrarInformacionInforme() {
    if (!!this.cargarInforme(this.idInforme)) {
      this.clasificarActividad(this.actividades);
      this.servicios = this.filtrarFecha(this.servicios);
      this.especiales = this.filtrarFecha(this.especiales);
      this.espirituales = this.filtrarFecha(this.espirituales);
      this.reuniones = this.filtrarFecha(this.reuniones);

      this.visitas = this.filtrarFecha(this.dataVisitas);
      this.situacionVisita = this.filtrarFecha(this.dataSituacionVisitas);
      this.aspectoContable = this.filtrarFechaCreatedAt(this.dataAspectoContable);
      this.metas = this.filtrarFecha(this.dataMetas);
      this.logros = this.filtrarFechaCreatedAt(this.dataLogros);
      this.asuntoPendiente = this.filtrarFechaCreatedAt(this.dataAsuntoPendiente);
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
