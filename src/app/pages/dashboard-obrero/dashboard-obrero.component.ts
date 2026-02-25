import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

// NGX Charts
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Services & Utils
import { DashboardObreroService } from 'src/app/services/dashboard-obrero/dashboard-obrero.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import {
  UsuarioCompleto,
  EstadisticasDashboard,
  FiltrosUsuarios,
  ConfiguracionOrdenamiento,
} from 'src/app/core/interfaces/dashboard-obrero.interface';
import {
  calcularEstadisticasDashboard,
  obtenerNombreCompleto,
  calcularEdad,
  exportarCSV,
} from 'src/app/core/utils/dashboard-obrero.utils';

@Component({
  selector: 'app-dashboard-obrero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    NgxChartsModule,
  ],
  templateUrl: './dashboard-obrero.component.html',
  styleUrl: './dashboard-obrero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardObreroComponent implements OnInit, AfterViewInit, OnDestroy {
  // Subject para limpiar suscripciones
  private destroy$ = new Subject<void>();

  // ViewChild para paginador y sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Injects
  private dashboardService = inject(DashboardObreroService);
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  // Signals
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  usuarios = signal<UsuarioCompleto[]>([]);
  usuariosFiltrados = signal<UsuarioCompleto[]>([]); // Signal para usuarios filtrados
  estadisticas = signal<EstadisticasDashboard | null>(null);
  cargandoGraficas = signal<boolean>(false); // Nuevo signal para loading de gráficas

  // Flag para evitar múltiples regeneraciones simultáneas de gráficas
  private regenerandoGraficas = false;

  // Form de filtros
  filtrosForm: FormGroup;

  // Tabla
  dataSource = new MatTableDataSource<UsuarioCompleto>([]);
  displayedColumns: string[] = ['idMita', 'nombre', 'email', 'celular', 'genero', 'edad', 'congregacion', 'estado'];
  totalUsuarios = 0;

  // Computed para filtros dinámicos
  generosDisponibles = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const generos = new Map<number, string>();
    usuarios.forEach((u) => {
      if (u.genero) {
        generos.set(u.genero.id, u.genero.genero);
      }
    });
    return Array.from(generos.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  estadosCivilesDisponibles = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const estados = new Map<number, string>();
    usuarios.forEach((u) => {
      if (u.estadoCivil) {
        estados.set(u.estadoCivil.id, u.estadoCivil.estadoCivil);
      }
    });
    return Array.from(estados.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  nacionalidadesDisponibles = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const nacionalidades = new Map<number, string>();
    usuarios.forEach((u) => {
      if (u.nacionalidad) {
        nacionalidades.set(u.nacionalidad.id, u.nacionalidad.nacionalidad);
      }
    });
    return Array.from(nacionalidades.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  congregacionesDisponibles = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const congregaciones = new Map<number, string>();
    usuarios.forEach((u) => {
      if (u.usuarioCongregacionCongregacion && u.usuarioCongregacionCongregacion.length > 0) {
        const cong = u.usuarioCongregacionCongregacion[0];
        congregaciones.set(cong.id, cong.congregacion);
      }
    });
    return Array.from(congregaciones.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  ministeriosDisponibles = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const ministerios = new Map<number, string>();
    usuarios.forEach((u) => {
      if (u.usuarioMinisterio && u.usuarioMinisterio.length > 0) {
        u.usuarioMinisterio.forEach((m) => {
          ministerios.set(m.id, m.ministerio);
        });
      }
    });
    return Array.from(ministerios.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  voluntariadosDisponibles = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const voluntariados = new Map<number, string>();
    usuarios.forEach((u) => {
      if (u.usuarioVoluntariado && u.usuarioVoluntariado.length > 0) {
        u.usuarioVoluntariado.forEach((v) => {
          voluntariados.set(v.id, v.nombreVoluntariado);
        });
      }
    });
    return Array.from(voluntariados.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  // Gráficos
  chartCongregaciones: any[] = [];
  chartCampos: any[] = [];
  chartMinisterios: any[] = [];
  chartEstadoCivil: any[] = [];
  chartGradoAcademico: any[] = [];
  chartGenero: any[] = [];
  chartTipoMiembro: any[] = [];
  chartVoluntariados: any[] = [];

  // Opciones de gráficos
  view: [number, number] = [600, 280];
  viewMainChart: any = undefined; // Sin restricciones para que ocupe todo el ancho
  viewPie: [number, number] = [300, 200];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Cantidad';
  yAxisLabel = '';
  colorScheme: any = {
    domain: ['#2F5597', '#DE5D83', '#F9A03F', '#00C9A7', '#845EC2', '#FF6F91', '#FFC75F', '#008E9B'],
  };
  legendPosition: any = 'below';
  legendTitle: string = '';
  animations: boolean = true;

  // Computed para el ancho dinámico de la gráfica de congregaciones
  viewCongregacionesChart = computed<[number, number] | undefined>(() => {
    const cantidadCongregaciones = this.chartCongregaciones.length;
    if (cantidadCongregaciones === 0) {
      return undefined;
    }
    // Calcular ancho: mínimo 100px por congregación, con un mínimo total de 900px
    const anchoPorCongregacion = 100;
    const anchoMinimo = 900;
    const anchoCalculado = Math.max(anchoMinimo, cantidadCongregaciones * anchoPorCongregacion);
    return [anchoCalculado, 400] as [number, number];
  });

  // Computed para el ancho dinámico de la gráfica de campos
  viewCamposChart = computed<[number, number] | undefined>(() => {
    const cantidadCampos = this.chartCampos.length;
    if (cantidadCampos === 0) {
      return undefined;
    }
    // Calcular ancho: mínimo 100px por campo, con un mínimo total de 900px
    const anchoPorCampo = 100;
    const anchoMinimo = 900;
    const anchoCalculado = Math.max(anchoMinimo, cantidadCampos * anchoPorCampo);
    return [anchoCalculado, 400] as [number, number];
  });

  // Computed para métricas adicionales
  edadMediana = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const edades = usuarios
      .map((u) => calcularEdad(u.fechaNacimiento))
      .filter((edad): edad is number => edad !== null)
      .sort((a, b) => a - b);

    if (edades.length === 0) return 0;

    const mid = Math.floor(edades.length / 2);
    return edades.length % 2 !== 0 ? edades[mid] : Math.floor((edades[mid - 1] + edades[mid]) / 2);
  });

  // Computed para verificar si hay más de una congregación
  tieneMasDeUnaCongregacion = computed(() => {
    return this.chartCongregaciones.length > 1;
  });

  totalCongregaciones = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const congregaciones = new Set<number>();
    usuarios.forEach((u) => {
      if (u.usuarioCongregacionCongregacion && u.usuarioCongregacionCongregacion.length > 0) {
        congregaciones.add(u.usuarioCongregacionCongregacion[0].id);
      }
    });
    return congregaciones.size;
  });

  totalCampos = computed(() => {
    const usuarios = this.usuariosFiltrados();
    const campos = new Set<number>();
    usuarios.forEach((u) => {
      if (u.usuarioCongregacionCampo && u.usuarioCongregacionCampo.length > 0) {
        u.usuarioCongregacionCampo.forEach((campo) => {
          campos.add(campo.id);
        });
      }
    });
    return campos.size;
  });

  totalJovenes = computed(() => {
    const usuarios = this.usuariosFiltrados();
    return usuarios.filter((u) => u.esJoven === true).length;
  });

  totalUsuariosFiltrados = computed(() => {
    return this.usuariosFiltrados().length;
  });

  constructor() {
    // Inicializar formulario de filtros
    this.filtrosForm = this.fb.group({
      textoBusqueda: [''],
      genero_id: [null],
      estadoCivil_id: [null],
      nacionalidad_id: [null],
      esJoven: [null],
      voluntariado: [null],
      voluntariado_id: [null],
      ministerio: [null],
      ministerio_id: [null],
      congregacion_id: [null],
      ciudad: [''],
      estado: [null],
      edadMin: [null],
      edadMax: [null],
    });

    // Suscribirse a cambios en los filtros con debouncing para optimizar rendimiento
    this.filtrosForm.valueChanges
      .pipe(
        debounceTime(300), // Esperar 300ms después del último cambio
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.aplicarFiltros();
      });
  }

  ngOnInit(): void {
    // Validar token
    if (!this.dashboardService.validateToken()) {
      this.error.set('Token no encontrado. Por favor, inicie sesión nuevamente.');
      this.cargando.set(false);
      return;
    }

    // Obtener obreroId (puedes ajustar esto según tu lógica de autenticación)
    const obreroId = this.obtenerObreroId();
    if (!obreroId) {
      this.error.set('No se pudo obtener el ID del obrero. Verifique su sesión.');
      this.cargando.set(false);
      return;
    }

    this.cargarDatos(obreroId);
  }

  ngAfterViewInit(): void {
    // Conectar paginador y sort al dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Forzar detección de cambios para que el paginador funcione correctamente
    // Esto es necesario cuando los datos se cargan antes de ngAfterViewInit
    this.cdr.detectChanges();

    // Configurar el sortingDataAccessor para ordenamiento personalizado
    this.dataSource.sortingDataAccessor = (item: UsuarioCompleto, property: string) => {
      switch (property) {
        case 'idMita':
          return item.id || 0;
        case 'nombre':
          return obtenerNombreCompleto(item).toLowerCase();
        case 'email':
          return (item.email || '').toLowerCase();
        case 'celular':
          return (item.numeroCelular || '').toLowerCase();
        case 'genero':
          return (item.genero?.genero || '').toLowerCase();
        case 'edad':
          return calcularEdad(item.fechaNacimiento) || 0;
        case 'congregacion':
          return (item.usuarioCongregacionCongregacion?.[0]?.congregacion || '').toLowerCase();
        case 'estado':
          return item.estado ? 1 : 0;
        default:
          return '';
      }
    };
  }

  /**
   * Cleanup cuando el componente se destruye
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Obtiene el ID del obrero desde el usuario logueado en UsuarioService
   */
  private obtenerObreroId(): number | null {
    // Obtener del usuario actual logueado
    if (this.usuarioService.usuario && this.usuarioService.usuario.id) {
      return this.usuarioService.usuario.id;
    }

    // Alternativa: usar el getter usuarioId
    if (this.usuarioService.usuarioId) {
      return this.usuarioService.usuarioId;
    }

    // Si aún no hay usuario cargado, intentar desde localStorage (fallback)
    const obreroIdStr = localStorage.getItem('obreroId');
    if (obreroIdStr) {
      const id = parseInt(obreroIdStr, 10);
      return id;
    }

    console.warn('Dashboard Obrero - No se pudo obtener obreroId');
    return null;
  }

  /**
   * Carga los datos del dashboard
   */
  private cargarDatos(obreroId: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.dashboardService.getUsuariosCompleto(obreroId).subscribe({
      next: (response) => {
        this.usuarios.set(response.data || []);
        this.procesarDatos();
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Dashboard Obrero - Error al cargar datos:', error);
        console.error('Dashboard Obrero - Error completo:', error);
        this.error.set(`Error al cargar los datos: ${error.message || 'Error desconocido'}`);
        this.cargando.set(false);
        this.mostrarError('Error al cargar los datos del dashboard');
      },
    });
  }

  /**
   * Procesa los datos y calcula estadísticas
   */
  private procesarDatos(): void {
    const usuarios = this.usuarios();

    // Inicializar usuarios filtrados con todos los usuarios
    this.usuariosFiltrados.set(usuarios);

    // Calcular estadísticas
    const stats = calcularEstadisticasDashboard(usuarios);
    this.estadisticas.set(stats);

    // Configurar tabla
    this.dataSource.data = usuarios;
    this.totalUsuarios = usuarios.length;

    // Re-conectar el paginador después de asignar datos
    // Usar setTimeout para asegurar que Angular complete el ciclo de detección
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.firstPage();
      }
    }, 0);

    // Generar datos para gráficos solo si hay usuarios
    if (usuarios.length > 0) {
      this.generarDatosGraficos();
    } else {
      // Limpiar gráficos si no hay datos
      this.chartCongregaciones = [];
      this.chartCampos = [];
      this.chartMinisterios = [];
      this.chartEstadoCivil = [];
      this.chartGradoAcademico = [];
      this.chartGenero = [];
      this.chartTipoMiembro = [];
      this.chartVoluntariados = [];
    }
  }

  /**
   * Genera los datos para los gráficos
   */
  private generarDatosGraficos(): void {
    const usuarios = this.usuariosFiltrados();

    // Helper para validar y formatear datos de gráficos
    const formatChartData = (dataMap: Map<string, number>, sort: boolean = true, limit?: number) => {
      let data = Array.from(dataMap.entries())
        .filter(([name, value]) => name && name.trim() !== '' && typeof value === 'number' && !isNaN(value))
        .map(([name, value]) => ({ name: name.trim(), value: Number(value) || 0 }));

      if (sort) {
        data = data.sort((a, b) => b.value - a.value);
      }

      if (limit) {
        data = data.slice(0, limit);
      }

      return data;
    };

    // Helper para obtener el orden de grados académicos
    const getGradoAcademicoOrder = (grado: string): number => {
      const orden: { [key: string]: number } = {
        'Sin especificar': 0,
        'Sin educación formal': 1,
        Primaria: 2,
        Elemental: 2,
        Secundaria: 3,
        Intermedia: 3,
        Superior: 4,
        Bachillerato: 4,
        'High School': 4,
        Técnico: 5,
        Vocacional: 5,
        Universitario: 6,
        Licenciatura: 6,
        Grado: 6,
        'Bachiller Universitario': 6,
        Maestría: 7,
        Master: 7,
        Doctorado: 8,
        PhD: 8,
      };

      // Buscar coincidencias parciales (case insensitive)
      const gradoLower = grado.toLowerCase();
      for (const [key, value] of Object.entries(orden)) {
        if (gradoLower.includes(key.toLowerCase()) || key.toLowerCase().includes(gradoLower)) {
          return value;
        }
      }

      return 999; // Otros al final
    };

    // Helper para obtener el orden de tipos de miembro
    const getTipoMiembroOrder = (tipo: string): number => {
      const orden: { [key: string]: number } = {
        Miembro: 1,
        'Miembro Bautizado': 1,
        Bautizado: 1,
        Catecúmeno: 2,
        Catecumeno: 2,
        'En proceso': 2,
        'En Proceso': 2,
        Adherente: 3,
        Simpatizante: 3,
        Visitante: 4,
        Visita: 4,
        Niño: 5,
        Menor: 5,
        Infante: 5,
        'Sin especificar': 999,
      };

      // Buscar coincidencias parciales (case insensitive)
      const tipoLower = tipo.toLowerCase();
      for (const [key, value] of Object.entries(orden)) {
        if (tipoLower.includes(key.toLowerCase()) || key.toLowerCase().includes(tipoLower)) {
          return value;
        }
      }

      return 998; // Otros antes de "Sin especificar"
    };

    // Gráfico de Congregaciones
    const congregacionesMap = new Map<string, number>();
    usuarios.forEach((u) => {
      if (u.usuarioCongregacionCongregacion && u.usuarioCongregacionCongregacion.length > 0) {
        const cong = u.usuarioCongregacionCongregacion[0]?.congregacion;
        if (cong && cong.trim() !== '') {
          congregacionesMap.set(cong, (congregacionesMap.get(cong) || 0) + 1);
        }
      }
    });
    this.chartCongregaciones = formatChartData(congregacionesMap, true, 15);

    // Gráfico de Campos
    const camposMap = new Map<string, number>();
    usuarios.forEach((u) => {
      if (u.usuarioCongregacionCampo && u.usuarioCongregacionCampo.length > 0) {
        const campo = u.usuarioCongregacionCampo[0]?.campo;
        if (campo && campo.trim() !== '') {
          camposMap.set(campo, (camposMap.get(campo) || 0) + 1);
        }
      }
    });
    this.chartCampos = formatChartData(camposMap, true, 15);

    // Gráfico de Ministerios (incluye todos los ministerios, no solo ejerceMinisterio)
    const ministeriosMap = new Map<string, number>();
    usuarios.forEach((u) => {
      if (u.usuarioMinisterio && u.usuarioMinisterio.length > 0) {
        u.usuarioMinisterio.forEach((m) => {
          const nombreMinisterio = m.ministerio || 'Sin especificar';
          ministeriosMap.set(nombreMinisterio, (ministeriosMap.get(nombreMinisterio) || 0) + 1);
        });
      }
    });

    this.chartMinisterios = formatChartData(ministeriosMap, true);

    // Gráfico de Estado Civil
    const estadoCivilMap = new Map<string, number>();
    usuarios.forEach((u) => {
      const estado = u.estadoCivil?.estadoCivil || 'Sin especificar';
      estadoCivilMap.set(estado, (estadoCivilMap.get(estado) || 0) + 1);
    });
    this.chartEstadoCivil = formatChartData(estadoCivilMap, true);

    // Gráfico de Grado Académico (ordenado por nivel educativo)
    const gradoAcademicoMap = new Map<string, number>();
    usuarios.forEach((u) => {
      const gradoObj = u.gradoAcademico as any;
      const grado = gradoObj?.grado || gradoObj?.gradoAcademico || 'Sin especificar';
      gradoAcademicoMap.set(grado, (gradoAcademicoMap.get(grado) || 0) + 1);
    });

    // Ordenar por nivel educativo en lugar de por cantidad
    this.chartGradoAcademico = Array.from(gradoAcademicoMap.entries())
      .filter(([name, value]) => name && name.trim() !== '' && typeof value === 'number' && !isNaN(value))
      .map(([name, value]) => ({ name: name.trim(), value: Number(value) || 0 }))
      .sort((a, b) => getGradoAcademicoOrder(a.name) - getGradoAcademicoOrder(b.name));

    // Gráfico de Género
    const generoMap = new Map<string, number>();
    usuarios.forEach((u) => {
      const genero = u.genero?.genero || 'Sin especificar';
      generoMap.set(genero, (generoMap.get(genero) || 0) + 1);
    });
    this.chartGenero = formatChartData(generoMap, false);

    // Gráfico de Tipo de Miembro (ordenado por nivel de compromiso)
    const tipoMiembroMap = new Map<string, number>();
    usuarios.forEach((u) => {
      const tipoObj = u.tipoMiembro as any;
      const tipo = tipoObj?.miembro || 'Sin especificar';
      tipoMiembroMap.set(tipo, (tipoMiembroMap.get(tipo) || 0) + 1);
    });

    // Ordenar por nivel de compromiso en lugar de por cantidad
    this.chartTipoMiembro = Array.from(tipoMiembroMap.entries())
      .filter(([name, value]) => name && name.trim() !== '' && typeof value === 'number' && !isNaN(value))
      .map(([name, value]) => ({ name: name.trim(), value: Number(value) || 0 }))
      .sort((a, b) => getTipoMiembroOrder(a.name) - getTipoMiembroOrder(b.name));

    // Gráfico de Voluntariados
    const voluntariadosMap = new Map<string, number>();
    usuarios.forEach((u) => {
      if (u.usuarioVoluntariado && u.usuarioVoluntariado.length > 0) {
        u.usuarioVoluntariado.forEach((v) => {
          const nombreVoluntariado = v.nombreVoluntariado || 'Sin especificar';
          voluntariadosMap.set(nombreVoluntariado, (voluntariadosMap.get(nombreVoluntariado) || 0) + 1);
        });
      }
    });

    this.chartVoluntariados = formatChartData(voluntariadosMap, true);
  }

  /**
   * Aplica los filtros a la tabla
   */
  private aplicarFiltros(): void {
    const filtros: FiltrosUsuarios = this.filtrosForm.value;
    const usuariosOriginales = this.usuarios();

    let usuariosFiltrados = [...usuariosOriginales];

    // Filtro por texto (busca en nombre, email, documento, apodo)
    if (filtros.textoBusqueda && filtros.textoBusqueda.trim()) {
      const texto = filtros.textoBusqueda.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        const nombreCompleto = obtenerNombreCompleto(u).toLowerCase();
        const email = (u.email || '').toLowerCase();
        const documento = (u.numeroDocumento || '').toLowerCase();
        const apodo = (u.apodo || '').toLowerCase();

        return (
          nombreCompleto.includes(texto) || email.includes(texto) || documento.includes(texto) || apodo.includes(texto)
        );
      });
    }

    // Filtro por género
    if (filtros.genero_id) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => u.genero_id === filtros.genero_id);
    }

    // Filtro por estado civil
    if (filtros.estadoCivil_id) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => u.estadoCivil_id === filtros.estadoCivil_id);
    }

    // Filtro por nacionalidad
    if (filtros.nacionalidad_id) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => u.nacionalidad_id === filtros.nacionalidad_id);
    }

    // Filtro por esJoven
    if (filtros.esJoven !== null && filtros.esJoven !== undefined) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => u.esJoven === filtros.esJoven);
    }

    // Filtro por voluntariado
    if (filtros.voluntariado !== null && filtros.voluntariado !== undefined) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        const tieneVoluntariado = u.usuarioVoluntariado && u.usuarioVoluntariado.length > 0;
        return filtros.voluntariado ? tieneVoluntariado : !tieneVoluntariado;
      });
    }

    // Filtro por voluntariado específico
    if (filtros.voluntariado_id) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        return u.usuarioVoluntariado && u.usuarioVoluntariado.some((v) => v.id === filtros.voluntariado_id);
      });
    }

    // Filtro por ministerio
    if (filtros.ministerio !== null && filtros.ministerio !== undefined) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        const ejerceMinisterio = u.usuarioMinisterio && u.usuarioMinisterio.some((m) => m.ejerceMinisterio);
        return filtros.ministerio ? ejerceMinisterio : !ejerceMinisterio;
      });
    }

    // Filtro por ministerio específico
    if (filtros.ministerio_id) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        return u.usuarioMinisterio && u.usuarioMinisterio.some((m) => m.id === filtros.ministerio_id);
      });
    }

    // Filtro por congregación
    if (filtros.congregacion_id) {
      usuariosFiltrados = usuariosFiltrados.filter(
        (u) =>
          u.usuarioCongregacionCongregacion &&
          u.usuarioCongregacionCongregacion.some((c) => c.id === filtros.congregacion_id),
      );
    }

    // Filtro por ciudad
    if (filtros.ciudad && filtros.ciudad.trim()) {
      const ciudad = filtros.ciudad.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(
        (u) => u.ciudadDireccion?.toLowerCase().includes(ciudad) || u.ciudadPostal?.toLowerCase().includes(ciudad),
      );
    }

    // Filtro por edad mínima
    if (filtros.edadMin !== null && filtros.edadMin !== undefined) {
      const edadMin = Number(filtros.edadMin);
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        const edad = calcularEdad(u.fechaNacimiento);
        return edad !== null && edad >= edadMin;
      });
    }

    // Filtro por edad máxima
    if (filtros.edadMax !== null && filtros.edadMax !== undefined) {
      const edadMax = Number(filtros.edadMax);
      usuariosFiltrados = usuariosFiltrados.filter((u) => {
        const edad = calcularEdad(u.fechaNacimiento);
        return edad !== null && edad <= edadMax;
      });
    }

    // Filtro por estado (activo/inactivo)
    if (filtros.estado !== null && filtros.estado !== undefined) {
      usuariosFiltrados = usuariosFiltrados.filter((u) => u.estado === filtros.estado);
    }

    // Actualizar signal de usuarios filtrados
    this.usuariosFiltrados.set(usuariosFiltrados);

    // Actualizar tabla
    this.dataSource.data = usuariosFiltrados;
    this.totalUsuarios = usuariosFiltrados.length;

    // Re-conectar y resetear paginador cuando cambian los datos
    // Usar setTimeout para asegurar que Angular complete el ciclo de detección
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.firstPage();
      }
    }, 0);

    // Regenerar gráficos con los datos filtrados usando requestAnimationFrame
    // para diferir la operación pesada y mantener la UI responsiva
    if (!this.regenerandoGraficas) {
      this.regenerandoGraficas = true;
      this.cargandoGraficas.set(true);
      requestAnimationFrame(() => {
        this.generarDatosGraficos();
        this.regenerandoGraficas = false;
        this.cargandoGraficas.set(false);
      });
    }
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros(): void {
    this.filtrosForm.reset({
      textoBusqueda: '',
      genero_id: null,
      estadoCivil_id: null,
      nacionalidad_id: null,
      esJoven: null,
      voluntariado: null,
      voluntariado_id: null,
      ministerio: null,
      ministerio_id: null,
      congregacion_id: null,
      ciudad: '',
      estado: null,
      edadMin: null,
      edadMax: null,
    });

    // Restaurar todos los usuarios
    this.usuariosFiltrados.set(this.usuarios());
  }

  /**
   * Exporta la tabla filtrada a CSV
   */
  exportarTablaCSV(): void {
    const usuariosVisible = this.dataSource.filteredData;

    const datos = usuariosVisible.map((u) => ({
      // Información personal básica
      ID: u.id,
      'Primer Nombre': u.primerNombre || '',
      'Segundo Nombre': u.segundoNombre || '',
      'Primer Apellido': u.primerApellido || '',
      'Segundo Apellido': u.segundoApellido || '',
      Apodo: u.apodo || '',
      'Nombre Completo': obtenerNombreCompleto(u),

      // Contacto
      Email: u.email || '',
      Login: u.login || '',
      Celular: u.numeroCelular || '',
      'Teléfono Casa': u.telefonoCasa || '',

      // Información demográfica
      'Fecha Nacimiento': u.fechaNacimiento || '',
      Edad: calcularEdad(u.fechaNacimiento) || '',
      'Es Joven': u.esJoven ? 'Sí' : 'No',
      Género: u.genero?.genero || '',
      'Estado Civil': u.estadoCivil?.estadoCivil || '',
      Nacionalidad: u.nacionalidad?.nacionalidad || '',

      // Documentación
      'Tipo Documento': u.tipoDocumento_id ? `ID: ${u.tipoDocumento_id}` : '',
      'Número Documento': u.numeroDocumento || '',

      // Información eclesiástica
      'Tipo de Miembro': (u.tipoMiembro as any)?.miembro || (u.tipoMiembro as any)?.tipo || '',
      'Rol en Casa': u.rolCasa?.rol || '',
      'Año Conocimiento': u.anoConocimiento || '',

      // Ubicación - Dirección
      Dirección: u.direccion || '',
      'Ciudad (Dirección)': u.ciudadDireccion || '',
      'Departamento (Dirección)': u.departamentoDireccion || '',
      'Código Postal (Dirección)': u.codigoPostalDireccion || '',
      'País (Dirección)': u.paisDireccion || '',

      // Ubicación - Dirección Postal
      'Dirección Postal': u.direccionPostal || '',
      'Ciudad (Postal)': u.ciudadPostal || '',
      'Departamento (Postal)': u.departamentoPostal || '',
      'Código Postal (Postal)': u.codigoPostal || '',
      'País (Postal)': u.paisPostal || '',

      // Educación y empleo
      'Grado Académico': (u.gradoAcademico as any)?.grado || (u.gradoAcademico as any)?.gradoAcademico || '',
      'Especialización/Empleo': u.especializacionEmpleo || '',

      // Congregación y organización
      Congregación: u.usuarioCongregacionCongregacion?.[0]?.congregacion || '',
      'ID Congregación': u.usuarioCongregacionCongregacion?.[0]?.id || '',
      Campos:
        u.usuarioCongregacionCampo && u.usuarioCongregacionCampo.length > 0
          ? u.usuarioCongregacionCampo.map((c) => c.campo).join(', ')
          : '',
      Países:
        u.usuarioCongregacionPais && u.usuarioCongregacionPais.length > 0
          ? u.usuarioCongregacionPais.map((p) => p.pais).join(', ')
          : '',

      // Ministerios
      Ministerios:
        u.usuarioMinisterio && u.usuarioMinisterio.length > 0
          ? u.usuarioMinisterio.map((m) => m.ministerio).join(', ')
          : '',
      'Ejerce Ministerio': u.usuarioMinisterio && u.usuarioMinisterio.some((m) => m.ejerceMinisterio) ? 'Sí' : 'No',

      // Voluntariados
      Voluntariados:
        u.usuarioVoluntariado && u.usuarioVoluntariado.length > 0
          ? u.usuarioVoluntariado.map((v) => v.nombreVoluntariado).join(', ')
          : '',

      // Estado y metadatos
      Estado: u.estado ? 'Activo' : 'Inactivo',
      'Fecha Creación': u.createdAt || '',
      'Fecha Actualización': u.updatedAt || '',
    }));

    exportarCSV(datos, 'usuarios_dashboard_obrero_completo');
  }

  /**
   * Ver detalle de un usuario
   */
  verDetalle(usuario: UsuarioCompleto): void {
    // Aquí puedes abrir un modal o navegar a una ruta de detalle
    this.mostrarInformacion(`Detalle de ${obtenerNombreCompleto(usuario)}`);

    // Ejemplo: navegación a ruta de detalle
    // this.router.navigate(['/dashboard/obrero/usuarios', usuario.id]);
  }

  /**
   * Recarga los datos del dashboard
   */
  recargar(): void {
    const obreroId = this.obtenerObreroId();
    if (obreroId) {
      this.cargarDatos(obreroId);
    }
  }

  // Helpers para el template
  obtenerNombreCompleto = obtenerNombreCompleto;
  calcularEdad = calcularEdad;

  obtenerCongregacion(usuario: UsuarioCompleto): string {
    return usuario.usuarioCongregacionCongregacion?.[0]?.congregacion || 'Sin congregación';
  }

  /**
   * Valida si un array de datos de gráfico tiene datos válidos
   */
  hasValidChartData(data: any[]): boolean {
    return (
      Array.isArray(data) &&
      data.length > 0 &&
      data.every(
        (item) =>
          item &&
          typeof item.name === 'string' &&
          item.name.trim() !== '' &&
          typeof item.value === 'number' &&
          !isNaN(item.value),
      )
    );
  }

  /**
   * Muestra un mensaje de error
   */
  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Muestra un mensaje informativo
   */
  private mostrarInformacion(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  /**
   * Abre la gráfica en pantalla completa
   */
  abrirGraficaFullscreen(titulo: string, data: any[], tipoGrafica: 'bar-vertical' | 'bar-horizontal' | 'pie'): void {
    this.dialog.open(GraficaFullscreenDialog, {
      width: '95vw',
      height: '95vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'fullscreen-dialog',
      data: {
        titulo,
        chartData: data,
        tipoGrafica,
        colorScheme: this.colorScheme,
        gradient: this.gradient,
        animations: this.animations,
      },
    });
  }
}

// Componente Dialog para mostrar gráficas en pantalla completa
@Component({
  selector: 'grafica-fullscreen-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, NgxChartsModule],
  template: `
    <div class="fullscreen-dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>{{ data.titulo }}</h2>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div mat-dialog-content class="dialog-content">
        @if (data.tipoGrafica === 'bar-vertical') {
          <ngx-charts-bar-vertical
            [results]="data.chartData"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="true"
            [showXAxisLabel]="false"
            [showYAxisLabel]="false"
            [gradient]="data.gradient"
            [scheme]="data.colorScheme"
            [animations]="data.animations"
            [showDataLabel]="true"
          >
          </ngx-charts-bar-vertical>
        }
        @if (data.tipoGrafica === 'bar-horizontal') {
          <ngx-charts-bar-horizontal
            [results]="data.chartData"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="true"
            [showXAxisLabel]="false"
            [showYAxisLabel]="false"
            [gradient]="data.gradient"
            [scheme]="data.colorScheme"
            [animations]="data.animations"
            [showDataLabel]="true"
          >
          </ngx-charts-bar-horizontal>
        }
        @if (data.tipoGrafica === 'pie') {
          <ngx-charts-pie-chart
            [results]="data.chartData"
            [legend]="true"
            [labels]="true"
            [doughnut]="false"
            [gradient]="data.gradient"
            [scheme]="data.colorScheme"
            [animations]="data.animations"
            [trimLabels]="false"
          >
          </ngx-charts-pie-chart>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .fullscreen-dialog-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: white;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 2px solid rgba(222, 93, 131, 0.2);
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);

        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #de5d83;
        }

        .close-button {
          color: rgba(0, 0, 0, 0.6);
        }
      }

      .dialog-content {
        flex: 1;
        padding: 24px;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        ::ng-deep {
          .ngx-charts {
            width: 100% !important;
            height: 100% !important;

            text {
              &.data-label {
                font-size: 14px;
                font-weight: 600;
                fill: #2f5597;
              }
            }
          }
        }
      }
    `,
  ],
})
export class GraficaFullscreenDialog {
  data = inject(MAT_DIALOG_DATA);
}
