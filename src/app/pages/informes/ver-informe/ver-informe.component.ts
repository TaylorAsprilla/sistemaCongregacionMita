import { Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Subscription } from 'rxjs';
import { SeccionInformeModel } from 'src/app/core/models/seccion-informe.model';
import { InformeService } from 'src/app/services/informe/informe.service';
import { ActividadService } from 'src/app/services/actividad/actividad.service';
import { TipoActividadService } from 'src/app/services/tipo-actividad/tipo-actividad.service';
import { TipoActividadModel } from 'src/app/core/models/tipo-actividad.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { UsuarioInterface } from 'src/app/core/interfaces/usuario.interface';
import { UsuarioCongregacionModel } from 'src/app/core/models/usuarioCongregacion.model';
import { ContabilidadModel } from 'src/app/core/models/contabilidad.model';
import { VisitaModel } from 'src/app/core/models/visita.model';
import { SituacionVisitaModel } from 'src/app/core/models/situacion-visita.model';
import { LogroModel } from 'src/app/core/models/logro.model';
import { MetaModel } from 'src/app/core/models/meta.model';
import { ActividadModel } from 'src/app/core/models/actividad.model';
import { InformeModel } from 'src/app/core/models/informe.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { ObreroModel } from 'src/app/core/models/obrero.model';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';

@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.css'],
  standalone: true,
})
export class VerInformeComponent implements OnInit, OnDestroy {
  private usuarioService = inject(UsuarioService);
  private ministerioService = inject(MinisterioService);
  private paisService = inject(PaisService);
  private informeService = inject(InformeService);
  private actividadService = inject(ActividadService);
  private tipoActividadService = inject(TipoActividadService);
  private activatedRoute = inject(ActivatedRoute);

  @ViewChild('content', { static: false }) el!: ElementRef;

  primerNombre: string = '';
  segundoNombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  fechaActual: Date = new Date();
  trimestre: string = '';
  fraccion: string = '';
  idInforme: number = 1;

  fechaSeleccionada: string = '';
  obreroSeleccionado: UsuarioModel;
  paisObrero: string = '';

  sumatoriaActividadesEspeciales: number = 0;
  sumatoriaActividadesEspirituales: number = 0;
  sumatoriaActividadesEnServicios: number = 0;
  sumatoriaActividadesEnReuniones: number = 0;

  usuarios: UsuarioModel[] = [];
  usuarioSubscription: Subscription;

  ministerios: MinisterioModel[] = [];
  ministerioSubcription: Subscription;

  paises: CongregacionPaisModel[] = [];
  paisSubscription: Subscription;

  actividadSubcription: Subscription;
  tipoActividadSubcription: Subscription;
  tipoActividades: TipoActividadModel[] = [];

  cargando: boolean = true;

  sumatoriaVisible: boolean = false;

  // desglosar informacion de informe
  informe: InformeModel[];
  actividades: ActividadModel[];

  servicios: ActividadModel[] = [];
  especiales: ActividadModel[] = [];
  espirituales: ActividadModel[] = [];
  reuniones: ActividadModel[] = [];

  aspectoContable: ContabilidadModel[] = [];
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

  congregaciones: CongregacionModel[] = [];
  obreros: UsuarioModel[] = [];

  public seccionesInformes: SeccionInformeModel[];
  informeSubscription: Subscription;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: any) => {
      this.seccionesInformes = data.seccionInforme;
      this.congregaciones = data.congregacion;
      this.obreros = data.obrero;
    });

    this.primerNombre = sessionStorage.getItem('primerNombre') || '';
    this.segundoNombre = sessionStorage.getItem('segundoNombre') || '';
    this.primerApellido = sessionStorage.getItem('primerApellido') || '';
    this.segundoApellido = sessionStorage.getItem('segundoApellido') || '';

    this.fechaActual = new Date();

    // this.filtrarInformacionInforme();
    this.cargarUsuarios();
    this.cargarMinisterios();
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

  // cargarInforme(idInforme: any) {
  //   this.informeSubscription = this.informeService.getInforme(idInforme).subscribe((respuesta: any[]) => {
  //     this.informe = respuesta;
  //     this.actividades = this.informe['actividades'];
  //     /// data var
  //     this.informacionInforme = this.informe['informacioninforme'];

  //     this.dataVisitas = this.informe['visitas'];
  //     this.dataSituacionVisitas = this.informe['situacionVisita'];
  //     this.dataLogros = this.informe['logros'];
  //     this.dataMetas = this.informe['metas'];
  //     this.dataAspectoContable = this.informe['aspectoContable'];
  //   });
  //   return true;
  // }

  cargarTipoActividad() {
    this.tipoActividadSubcription = this.tipoActividadService.getTipoActividad().subscribe((nombre) => {
      this.tipoActividades = nombre;
    });
  }

  clasificarActividad(conjunto: ActividadModel[]) {
    if (conjunto) {
      conjunto.forEach((actividad) => {
        let idTipoAct = actividad.tipoActividad_id;
        let idSec = this.tipoActividades.find((item) => item.id === idTipoAct)?.idSeccion;
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

  // filtrarFecha(conjunto: any) {
  //   let result: any[] = [];
  //   let yearSelect = this.fechaSeleccionada.slice(0, 4);
  //   let monthSelect = this.fechaSeleccionada.slice(5, 7);
  //   let monthSelectNum = Number(monthSelect);
  //   let daySelect = this.fechaSeleccionada.slice(8, 10);
  //   conjunto.forEach((actividad: any) => {
  //     let fecha = actividad.fecha;
  //     let year = fecha.slice(0, 4);
  //     let month = fecha.slice(5, 7);
  //     let monthNum = Number(month);

  //     let day = fecha.slice(8, 10);

  //     let min = this.selectMinMaxMonth(monthSelect)[0];
  //     let max = this.selectMinMaxMonth(monthSelect)[1];
  //     if (yearSelect == year) {
  //       if (monthNum >= min && monthNum <= max) {
  //         result.push(actividad);
  //       }
  //     }
  //   });

  //   return result;
  // }

  selectMinMaxMonth(mes: number) {
    let min, max;
    if (mes >= 1 && mes <= 3) {
      min = 1;
      max = 3;
    }
    if (mes >= 4 && mes <= 6) {
      min = 4;
      max = 6;
    }
    if (mes >= 7 && mes <= 9) {
      min = 7;
      max = 9;
    }
    if (mes >= 10 && mes <= 12) {
      min = 10;
      max = 12;
    }
    return [min, max];
  }

  // filtrarFechaCreatedAt(conjunto: any[]) {
  //   let result: any[] = [];
  //   let yearSelect = this.fechaSeleccionada.slice(0, 4);
  //   let monthSelect = this.fechaSeleccionada.slice(5, 7);
  //   let monthSelectNum = Number(monthSelect);
  //   conjunto.forEach((actividad) => {
  //     let fecha = actividad.createdAt;
  //     let year = fecha.slice(0, 4);
  //     let month = fecha.slice(5, 7);
  //     let monthNum = Number(month);
  //     let min = this.selectMinMaxMonth(monthSelect)[0];
  //     let max = this.selectMinMaxMonth(monthSelect)[1];
  //     if (yearSelect == year) {
  //       if (monthNum >= min && monthNum <= max) {
  //         result.push(actividad);
  //       }
  //     }
  //   });
  //   return result;
  // }

  getTipoActividadName(id: number) {
    try {
      return this.tipoActividades[id]['nombre'];
    } catch (exception_var) {
      ('cant find name with that id');
    }
    return id;
  }

  cargarUsuarios() {
    this.usuarioSubscription = this.usuarioService.listarTodosLosUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.usuarios = usuarios.filter((usuario: UsuarioModel) => usuario.estado == true);
    });
  }

  cargarMinisterios() {
    this.ministerioSubcription = this.ministerioService.getMinisterios().subscribe((ministerios) => {
      this.ministerios = ministerios.filter((ministerio: MinisterioModel) => ministerio.estado === true);
    });
  }

  cargarPaises() {
    this.paisSubscription = this.paisService.getPaises().subscribe((pais) => {
      this.paises = pais.filter((pais: CongregacionPaisModel) => pais.estado === true);
    });
  }

  seleccionarObrero(obreroSeleccionado: UsuarioModel) {
    let obreroInforme: UsuarioCongregacionModel;

    this.usuarioService.getUsuario(obreroSeleccionado.id).subscribe((obrero: UsuarioInterface) => {
      obreroInforme = obrero.usuarioCongregacion;

      this.paisObrero =
        this.paises.find((pais: CongregacionPaisModel) => pais.id === obreroInforme?.pais_id)?.pais || '';
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
    // this.filtrarInformacionInforme();
    this.sumatoriaActividadesEspeciales = this.sumatoriaActividades(this.especiales);
    this.sumatoriaActividadesEspirituales = this.sumatoriaActividades(this.espirituales);
    this.sumatoriaActividadesEnServicios = this.sumatoriaActividades(this.servicios);
    this.sumatoriaActividadesEnReuniones = this.sumatoriaActividades(this.reuniones);
  }

  // filtrarInformacionInforme() {
  //   if (!!this.cargarInforme(this.idInforme)) {
  //     this.clasificarActividad(this.actividades);
  //     this.servicios = this.filtrarFecha(this.servicios);
  //     this.especiales = this.filtrarFecha(this.especiales);
  //     this.espirituales = this.filtrarFecha(this.espirituales);
  //     this.reuniones = this.filtrarFecha(this.reuniones);

  //     this.visitas = this.filtrarFecha(this.dataVisitas);
  //     this.situacionVisita = this.filtrarFecha(this.dataSituacionVisitas);
  //     this.aspectoContable = this.filtrarFechaCreatedAt(this.dataAspectoContable);
  //     this.metas = this.filtrarFecha(this.dataMetas);
  //     this.logros = this.filtrarFechaCreatedAt(this.dataLogros);
  //   }
  // }

  sumatoriaActividades(actividades: any) {
    var total = 0;
    actividades.forEach((actividad: any) => {
      total += +actividad.cantidadRecaudada;
    });
    this.sumatoriaVisible = true;
    return total;
  }

  // makePDF() {
  //   let pdf = new jsPDF('p', 'pt', 'a4');
  //   let pWidth = pdf.internal.pageSize.width; // 595.28 is the width of a4
  //   let srcWidth = document.getElementById('content')?.scrollWidth;
  //   let margin = 18; // narrow margin - 1.27 cm (36);
  //   let scale = (pWidth - margin * 2) / srcWidth;

  //   pdf.html(document.getElementById('content'), {
  //     x: margin,
  //     y: margin,
  //     html2canvas: {
  //       scale: scale,
  //     },
  //     callback: function () {
  //       window.open(pdf.output('bloburl'));
  //     },
  //   });
  // }
}
