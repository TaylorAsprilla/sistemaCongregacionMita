import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import {
  EstadisticasPais,
  InformeCompletoPais,
  UnidadInformePendiente,
  UsuarioInforme,
} from 'src/app/core/interfaces/informe.interface';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CampoModel } from 'src/app/core/models/campo.model';
import { WhatsappPipe } from 'src/app/pipes/whatsapp/whatsapp.pipe';
import { TelegramPipe } from 'src/app/pipes/telegram/telegram.pipe';
import Swal from 'sweetalert2';
import { ROLES, RUTAS } from 'src/app/routes/menu-items';
import { DashboardSupervisionComponent } from 'src/app/pages/administracion/reportes/dashboard-supervision/dashboard-supervision.component';
import { obtenerPeriodoInforme, obtenerPeriodoInformeDesdeFecha } from 'src/app/core/utils/periodo-informe';

@Component({
  selector: 'app-ver-informes-pais',
  templateUrl: './ver-informes-pais.component.html',
  styleUrls: ['./ver-informes-pais.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, WhatsappPipe, TelegramPipe, DashboardSupervisionComponent],
})
export class VerInformesPaisComponent implements OnInit {
  private informeService = inject(InformeService);
  private usuarioService = inject(UsuarioService);
  private paisService = inject(PaisService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Datos de la API
  informes: InformeCompletoPais[] = [];
  informesFiltrados: InformeCompletoPais[] = [];
  informesPaginados: InformeCompletoPais[] = [];
  estadisticas: EstadisticasPais | null = null;
  pendientes: UnidadInformePendiente[] = [];
  pendientesFiltrados: UnidadInformePendiente[] = [];

  // Países
  paises: CongregacionPaisModel[] = [];
  paisesDisponibles: CongregacionPaisModel[] = [];

  // Listas de congregaciones y campos desde resolvers
  todasCongregaciones: CongregacionModel[] = [];
  todosCampos: CampoModel[] = [];
  congregaciones: { id: number; nombre: string }[] = [];
  campos: { id: number; nombre: string }[] = [];

  // Filtros
  busqueda: string = '';
  congregacionSeleccionada: number = 0;
  campoSeleccionado: number = 0;

  // Parámetros de consulta
  trimestre: number = 1;
  anio: number = new Date().getFullYear();
  paisId: number = 0;

  get esObreroPais(): boolean {
    return (
      this.usuarioService.usuario?.usuarioPermiso?.some(
        (permiso) => permiso.permiso === ROLES.OBRERO_PAIS,
      ) ?? false
    );
  }

  // Estados
  cargando: boolean = false;
  errorCarga: boolean = false;
  mostrarFiltros: boolean = false;
  selectedContact: number | null = null;
  vistaActiva: 'dashboard' | 'informes' = 'informes';
  listaActiva: 'recibidos' | 'pendientes' = 'recibidos';
  todosPeriodos = false;
  private paginaRestaurada: number | null = null;
  paginaInformes = 1;
  informesPorPagina = 10;
  ordenInformes: 'obrero' | 'congregacion' | 'campo' | 'estado' = 'obrero';
  ordenInformesAscendente = true;

  // Trimestres disponibles
  trimestres = [
    { value: 1, label: 'Primer Trimestre (Enero - Marzo)' },
    { value: 2, label: 'Segundo Trimestre (Abril - Junio)' },
    { value: 3, label: 'Tercer Trimestre (Julio - Septiembre)' },
    { value: 4, label: 'Cuarto Trimestre (Octubre - Diciembre)' },
  ];

  // Años disponibles (últimos 5 años)
  anios: number[] = [];

  ngOnInit(): void {
    const periodoActivo = obtenerPeriodoInforme();
    this.trimestre = periodoActivo.trimestre;
    this.anio = periodoActivo.anio;
    this.generarAnios();
    const estado = this.informeService.estadoListaPais;
    this.informeService.estadoListaPais = null;
    if (estado && estado.usuarioId === this.usuarioService.usuario?.id) {
      this.paisId = estado.paisId;
      this.trimestre = estado.trimestre;
      this.anio = estado.anio;
      this.todosPeriodos = estado.todosPeriodos;
      this.busqueda = estado.busqueda;
      this.congregacionSeleccionada = estado.congregacionSeleccionada;
      this.campoSeleccionado = estado.campoSeleccionado;
      this.informesPorPagina = estado.informesPorPagina;
      this.ordenInformes = estado.ordenInformes;
      this.ordenInformesAscendente = estado.ordenInformesAscendente;
      this.mostrarFiltros = estado.mostrarFiltros;
      this.paginaRestaurada = estado.paginaInformes;
    }
    this.cargarDatosResolvers();
    this.cargarPaises();
  }

  seleccionarVista(vista: 'dashboard' | 'informes'): void {
    this.vistaActiva = vista === 'dashboard' && !this.esObreroPais ? 'informes' : vista;
  }

  /**
   * Carga los datos de los resolvers
   */
  cargarDatosResolvers(): void {
    this.route.data.subscribe((data) => {
      this.todasCongregaciones = data['congregaciones'] || [];
      this.todosCampos = data['campos'] || [];
    });
  }

  /**
   * Genera lista de años disponibles
   */
  generarAnios(): void {
    const anioActual = this.anio;
    for (let i = 0; i < 5; i++) {
      this.anios.push(anioActual - i);
    }
  }

  /**
   * Carga todos los países y filtra por obrero encargado
   */
  cargarPaises(): void {
    const usuario = this.usuarioService.usuario;

    if (!usuario?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la información del usuario.',
      });
      return;
    }

    this.cargando = true;

    this.paisService.getPaises().subscribe({
      next: (paises) => {
        this.paises = paises;

        // Filtrar países donde el usuario es obrero encargado
        this.paisesDisponibles = paises.filter((pais) => pais.idObreroEncargado === usuario.id && pais.estado);

        if (this.paisesDisponibles.length > 0) {
          // Seleccionar automáticamente el primer país disponible
          if (!this.paisesDisponibles.some((pais) => pais.id === this.paisId)) {
            this.paisId = this.paisesDisponibles[0].id;
            this.congregacionSeleccionada = 0;
            this.campoSeleccionado = 0;
          }
          this.filtrarCongregacionesPorPais();
          this.cargarInformes();
        } else {
          this.cargando = false;
          Swal.fire({
            icon: 'warning',
            title: 'Sin países asignados',
            text: 'No tienes países asignados como obrero encargado.',
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar países:', error);
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los países. Por favor, intente nuevamente.',
        });
      },
    });
  }

  /**
   * Cuando cambia el país seleccionado
   */
  onPaisChange(): void {
    if (this.paisId > 0) {
      this.congregacionSeleccionada = 0;
      this.campoSeleccionado = 0;
      this.filtrarCongregacionesPorPais();
      this.cargarInformes();
    }
  }

  /**
   * Carga los informes del trimestre
   */
  cargarInformes(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.informeService.getInformesTrimestrePais(this.trimestre, this.anio, this.paisId, this.todosPeriodos).subscribe({
      next: (response) => {
        if (response.ok) {
          this.informes = response.informes;
          this.informesFiltrados = [...this.informes];
          this.estadisticas = response.estadisticas;
          this.pendientes = response.pendientes ?? [];
          this.aplicarFiltros();
          if (this.paginaRestaurada !== null) {
            this.cambiarPaginaInformes(Math.min(this.paginaRestaurada, this.totalPaginasInformes));
            this.paginaRestaurada = null;
          }
        } else {
          this.errorCarga = true;
          Swal.fire({
            icon: 'warning',
            title: 'Sin resultados',
            text: response.msg || 'No se encontraron informes para el período seleccionado',
          });
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar informes:', error);
        this.errorCarga = true;
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los informes. Por favor, intente nuevamente.',
        });
      },
    });
  }

  /**
   * Filtra congregaciones por país seleccionado
   */
  filtrarCongregacionesPorPais(): void {
    this.congregaciones = this.todasCongregaciones
      .filter((congregacion) => congregacion.pais_id === this.paisId && congregacion.estado)
      .map((congregacion) => ({
        id: congregacion.id,
        nombre: congregacion.congregacion,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.actualizarCamposDisponibles();
  }

  /**
   * Actualiza la lista de campos según la congregación seleccionada
   */
  actualizarCamposDisponibles(): void {
    if (this.congregacionSeleccionada > 0) {
      this.campos = this.todosCampos
        .filter((campo) => {
          const coincide = campo.congregacion_id === Number(this.congregacionSeleccionada) && campo.estado;

          return coincide;
        })
        .map((campo) => ({
          id: campo.id,
          nombre: campo.campo,
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      // Mostrar todos los campos de las congregaciones del país
      const congregacionesIds = this.congregaciones.map((c) => c.id);

      this.campos = this.todosCampos
        .filter((campo) => congregacionesIds.includes(campo.congregacion_id) && campo.estado)
        .map((campo) => ({
          id: campo.id,
          nombre: campo.campo,
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }

  /**
   * Cuando cambia la congregación seleccionada
   */
  onCongregacionChange(): void {
    const congSeleccionada = this.congregaciones.find((c) => c.id === this.congregacionSeleccionada);

    this.campoSeleccionado = 0;
    this.actualizarCamposDisponibles();
    this.aplicarFiltros();
  }

  /**
   * Aplica filtros de búsqueda
   */
  aplicarFiltros(): void {
    const busqueda = this.busqueda.toLowerCase();
    this.informesFiltrados = this.informes.filter((informe) => {
      const nombreCompleto = this.obtenerNombreCompleto(informe.usuario).toLowerCase();

      const cumpleBusqueda = !busqueda || nombreCompleto.includes(busqueda);

      // Obtener IDs de congregación y campo del usuario en el informe
      const congregacionNombre = informe.usuario.congregacion?.nombre || '';
      const campoNombre = informe.usuario.campo?.nombre || '';

      // Buscar IDs correspondientes en las listas completas
      const congEncontrada = this.todasCongregaciones.find((c) => c.congregacion === congregacionNombre);
      const campoEncontrado = this.todosCampos.find((c) => c.campo === campoNombre);

      const congregacionId = informe.usuario.campo?.congregacion_id ?? informe.usuario.congregacion?.id ?? congEncontrada?.id ?? 0;
      const campoId = informe.usuario.campo?.id ?? campoEncontrado?.id ?? 0;

      const cumpleCongregacion =
        this.congregacionSeleccionada === 0 || congregacionId === this.congregacionSeleccionada;

      const cumpleCampo = this.campoSeleccionado === 0 || campoId === this.campoSeleccionado;

      return cumpleBusqueda && cumpleCongregacion && cumpleCampo;
    });

    this.pendientesFiltrados = this.pendientes.filter((unidad) => {
      const cumpleCongregacion =
        this.congregacionSeleccionada === 0 ||
        unidad.congregacion_id === this.congregacionSeleccionada;
      const cumpleCampo = this.campoSeleccionado === 0 || unidad.campo_id === this.campoSeleccionado;
      const cumpleBusqueda = !busqueda || unidad.nombre.toLowerCase().includes(busqueda) ||
        unidad.responsables?.some((usuario) => this.obtenerNombreCompleto(usuario).toLowerCase().includes(busqueda));
      return cumpleCongregacion && cumpleCampo && cumpleBusqueda;
    });

    this.paginaInformes = 1;
    this.ordenarListaInformes();
  }

  ordenarInformesPor(campo: 'obrero' | 'congregacion' | 'campo' | 'estado'): void {
    if (this.ordenInformes === campo) {
      this.ordenInformesAscendente = !this.ordenInformesAscendente;
    } else {
      this.ordenInformes = campo;
      this.ordenInformesAscendente = true;
    }
    this.ordenarListaInformes();
  }

  cambiarPaginaInformes(pagina: number): void {
    const totalPaginas = Math.max(1, Math.ceil(this.informesFiltrados.length / this.informesPorPagina));
    if (pagina < 1 || pagina > totalPaginas) return;
    this.paginaInformes = pagina;
    this.actualizarPaginaInformes();
  }

  cambiarTamanoPaginaInformes(tamano: number | string): void {
    const nuevoTamano = Number(tamano);
    if (!Number.isInteger(nuevoTamano) || nuevoTamano < 1) return;
    this.informesPorPagina = nuevoTamano;
    this.paginaInformes = 1;
    this.actualizarPaginaInformes();
  }

  private ordenarListaInformes(): void {
    const direccion = this.ordenInformesAscendente ? 1 : -1;
    this.informesFiltrados = [...this.informesFiltrados].sort((a, b) => {
      const valorA = this.valorOrdenInforme(a, this.ordenInformes);
      const valorB = this.valorOrdenInforme(b, this.ordenInformes);
      return direccion * valorA.localeCompare(valorB, undefined, { numeric: true, sensitivity: 'base' });
    });
    this.actualizarPaginaInformes();
  }

  private valorOrdenInforme(
    informe: InformeCompletoPais,
    campo: 'obrero' | 'congregacion' | 'campo' | 'estado',
  ): string {
    switch (campo) {
      case 'obrero':
        return this.obtenerNombreCompleto(informe.usuario);
      case 'congregacion':
        return this.obtenerCongregacion(informe.usuario);
      case 'campo':
        return this.obtenerCampo(informe.usuario);
      case 'estado':
        return informe.estado || '';
    }
  }

  private actualizarPaginaInformes(): void {
    const inicio = (this.paginaInformes - 1) * this.informesPorPagina;
    this.informesPaginados = this.informesFiltrados.slice(inicio, inicio + this.informesPorPagina);
  }

  get totalPaginasInformes(): number {
    return Math.max(1, Math.ceil(this.informesFiltrados.length / this.informesPorPagina));
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros(): void {
    this.busqueda = '';
    this.congregacionSeleccionada = 0;
    this.campoSeleccionado = 0;
    this.actualizarCamposDisponibles();
    this.aplicarFiltros();
  }

  /**
   * Obtiene el nombre completo del obrero
   */
  obtenerNombreCompleto(usuario: Pick<UsuarioInforme, 'primerNombre' | 'segundoNombre' | 'primerApellido' | 'segundoApellido'>): string {
    return [usuario.primerNombre, usuario.segundoNombre, usuario.primerApellido, usuario.segundoApellido].filter(Boolean).join(' ');
  }

  /**
   * Obtiene el nombre de la congregación
   */
  obtenerCongregacion(usuario: any): string {
    return usuario.congregacion?.nombre || 'Sin asignar';
  }

  obtenerCongregacionPorId(id: number): { id: number; nombre: string } | undefined {
    return this.congregaciones.find((congregacion) => congregacion.id === id);
  }

  /**
   * Obtiene el nombre del campo
   */
  obtenerCampo(usuario: any): string {
    return usuario.campo?.nombre || 'Sin asignar';
  }

  /**
   * Navega al detalle del informe
   */
  verDetalleInforme(informeId: number): void {
    // Buscar el informe en el listado actual para pasar sus datos
    const informe = this.informesFiltrados.find((i) => i.id === informeId);
    this.informeService.estadoListaPais = {
      usuarioId: this.usuarioService.usuario.id,
      paisId: this.paisId, trimestre: this.trimestre, anio: this.anio,
      todosPeriodos: this.todosPeriodos, busqueda: this.busqueda,
      congregacionSeleccionada: this.congregacionSeleccionada, campoSeleccionado: this.campoSeleccionado,
      paginaInformes: this.paginaInformes, informesPorPagina: this.informesPorPagina,
      ordenInformes: this.ordenInformes, ordenInformesAscendente: this.ordenInformesAscendente,
      mostrarFiltros: this.mostrarFiltros,
    };

    this.router.navigate(['/sistema', RUTAS.VER_INFORME, informeId], {
      state: {
        informeData: informe,
        fromListaPais: true,
      },
    });
  }

  cambiarConsultaPeriodo(): void {
    if (this.todosPeriodos) {
      const periodo = obtenerPeriodoInforme();
      this.trimestre = periodo.trimestre;
      this.anio = periodo.anio;
    }
    this.cargarInformes();
  }

  obtenerPeriodoListado(informe: InformeCompletoPais): string {
    const periodo = obtenerPeriodoInformeDesdeFecha(informe.periodo || informe.createdAt);
    return periodo ? `T${periodo.trimestre} · ${periodo.anio}` : 'Sin periodo';
  }

  /**
   * Alterna la visibilidad de los filtros
   */
  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  /**
   * Alterna la visibilidad de los iconos de contacto
   */
  toggleIcons(informe: InformeCompletoPais): void {
    this.selectedContact = this.selectedContact === informe.id ? null : informe.id;
  }

  /**
   * Recarga los informes
   */
  recargar(): void {
    this.cargarInformes();
  }
}
