import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InformeService } from 'src/app/services/informe/informe.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { InformeCompletoPais, EstadisticasPais } from 'src/app/core/interfaces/informe.interface';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CampoModel } from 'src/app/core/models/campo.model';
import { WhatsappPipe } from 'src/app/pipes/whatsapp/whatsapp.pipe';
import { TelegramPipe } from 'src/app/pipes/telegram/telegram.pipe';
import Swal from 'sweetalert2';
import { RUTAS } from 'src/app/routes/menu-items';

@Component({
  selector: 'app-ver-informes-pais',
  templateUrl: './ver-informes-pais.component.html',
  styleUrls: ['./ver-informes-pais.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, WhatsappPipe, TelegramPipe],
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
  estadisticas: EstadisticasPais | null = null;

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

  // Estados
  cargando: boolean = false;
  errorCarga: boolean = false;
  mostrarFiltros: boolean = false;
  selectedContact: number | null = null;
  informeInfoExpandido: number | null = null;

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
    this.generarAnios();
    this.cargarDatosResolvers();
    this.cargarPaises();
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
    const anioActual = new Date().getFullYear();
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
          this.paisId = this.paisesDisponibles[0].id;
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

    this.informeService.getInformesTrimestrePais(this.trimestre, this.anio, this.paisId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.informes = response.informes;
          this.informesFiltrados = [...this.informes];
          this.estadisticas = response.estadisticas;
          this.aplicarFiltros();
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
    this.informesFiltrados = this.informes.filter((informe) => {
      const nombreCompleto = this.obtenerNombreCompleto(informe.usuario).toLowerCase();

      const cumpleBusqueda = !this.busqueda || nombreCompleto.includes(this.busqueda.toLowerCase());

      // Obtener IDs de congregación y campo del usuario en el informe
      const congregacionNombre = informe.usuario.congregacion?.nombre || '';
      const campoNombre = informe.usuario.campo?.nombre || '';

      // Buscar IDs correspondientes en las listas completas
      const congEncontrada = this.todasCongregaciones.find((c) => c.congregacion === congregacionNombre);
      const campoEncontrado = this.todosCampos.find((c) => c.campo === campoNombre);

      const congregacionId = congEncontrada?.id || 0;
      const campoId = campoEncontrado?.id || 0;

      const cumpleCongregacion =
        this.congregacionSeleccionada === 0 || congregacionId === this.congregacionSeleccionada;

      const cumpleCampo = this.campoSeleccionado === 0 || campoId === this.campoSeleccionado;

      return cumpleBusqueda && cumpleCongregacion && cumpleCampo;
    });
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
  obtenerNombreCompleto(usuario: any): string {
    return `${usuario.primerNombre} ${usuario.segundoNombre} ${usuario.primerApellido} ${usuario.segundoApellido}`.trim();
  }

  /**
   * Obtiene el nombre de la congregación
   */
  obtenerCongregacion(usuario: any): string {
    return usuario.congregacion?.nombre || 'Sin asignar';
  }

  /**
   * Obtiene el nombre del campo
   */
  obtenerCampo(usuario: any): string {
    return usuario.campo?.nombre || 'Sin asignar';
  }

  /**
   * Calcula el total de actividades
   */
  getTotalActividades(informe: InformeCompletoPais): number {
    return informe.actividades?.length || 0;
  }

  /**
   * Calcula el total de actividades económicas
   */
  getTotalActividadesEconomicas(informe: InformeCompletoPais): number {
    return informe.actividadesEconomicas?.length || 0;
  }

  /**
   * Calcula el total de visitas
   */
  getTotalVisitas(informe: InformeCompletoPais): number {
    return informe.visitas?.length || 0;
  }

  /**
   * Calcula el total de logros
   */
  getTotalLogros(informe: InformeCompletoPais): number {
    return informe.logros?.length || 0;
  }

  /**
   * Calcula el total de metas
   */
  getTotalMetas(informe: InformeCompletoPais): number {
    return informe.metas?.length || 0;
  }

  /**
   * Calcula el total de actividades eclesiásticas de todos los informes
   */
  getTotalActividadesEclesiasticas(): number {
    return this.informes.reduce((total, informe) => total + (informe.actividades?.length || 0), 0);
  }

  /**
   * Calcula el total de actividades económicas de todos los informes
   */
  getTotalActividadesEconomicasGlobal(): number {
    return this.informes.reduce((total, informe) => total + (informe.actividadesEconomicas?.length || 0), 0);
  }

  /**
   * Navega al detalle del informe
   */
  verDetalleInforme(informeId: number): void {
    // Buscar el informe en el listado actual para pasar sus datos
    const informe = this.informesFiltrados.find((i) => i.id === informeId);

    this.router.navigate(['/sistema', RUTAS.VER_INFORME, informeId], {
      state: {
        informeData: informe,
        fromListaPais: true,
      },
    });
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
   * Alterna la visibilidad de la información del obrero
   */
  toggleInfoObrero(informeId: number): void {
    this.informeInfoExpandido = this.informeInfoExpandido === informeId ? null : informeId;
  }

  /**
   * Recarga los informes
   */
  recargar(): void {
    this.cargarInformes();
  }
}
