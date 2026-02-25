import { CONGREGACION_ID } from './../../core/enums/congregacionPais.enum';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UsuarioInterface, UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { TIPO_DOCUMENTO_ID } from 'src/app/core/models/tipo-documento.model';
import Swal from 'sweetalert2';
import { MinisterioModel } from 'src/app/core/models/ministerio.model';
import { VoluntariadoModel } from 'src/app/core/models/voluntariado.model';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { PaisService } from 'src/app/services/pais/pais.service';
import { CampoService } from 'src/app/services/campo/campo.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TelegramPipe } from '../../pipes/telegram/telegram.pipe';
import { WhatsappPipe } from '../../pipes/whatsapp/whatsapp.pipe';
import { CalcularEdadPipe } from '../../pipes/calcularEdad/calcular-edad.pipe';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';
import { configuracion } from 'src/environments/config/configuration';
import { obtenerBanderaPais, obtenerCodigoIsoPais } from 'src/app/core/utils/banderas-paises.utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver-censo',
  templateUrl: './ver-censo.component.html',
  styleUrls: ['./ver-censo.component.scss'],
  standalone: true,
  imports: [FormsModule, NgClass, NgxPaginationModule, TelegramPipe, WhatsappPipe, CalcularEdadPipe, DecimalPipe],
})
export class VerCensoComponent implements OnInit, OnChanges, OnDestroy {
  private usuarioService = inject(UsuarioService);
  private paisService = inject(PaisService);
  private congregacionService = inject(CongregacionService);
  private campoService = inject(CampoService);
  private breakpointService = inject(BreakpointObserver);
  private exportarExcelService = inject(ExportarExcelService);

  @Input() usuarios: UsuariosPorCongregacionInterface[] = [];
  @Input() campos: CampoModel[] = [];

  @Input() paises: CongregacionPaisModel[] = [];
  @Input() totalUsuarios: number = 0;

  @Input() nombrePais: string = '';
  @Input() nombreCongregacion: string = '';
  @Input() nombreArchivo: string = '';
  @Input() mostrarNombreCongregacion: boolean = false;
  @Input() mostrarNombreCampo: boolean = false;
  @Input() titulo: string = '';

  @Output() crearUsuario = new EventEmitter<void>();
  @Output() actualizaUsuario: EventEmitter<number> = new EventEmitter<number>();
  @Output() activarUsuario: EventEmitter<number> = new EventEmitter<number>();
  @Output() borrarUsuario: EventEmitter<UsuariosPorCongregacionInterface> =
    new EventEmitter<UsuariosPorCongregacionInterface>();
  @Output() enviarEmail: EventEmitter<number> = new EventEmitter<number>();
  @Output() transferirUsuario = new EventEmitter<{
    pais: number;
    congregacion: number;
    campo: number;
    id: number;
  }>();
  @Output() transcenderUsuario: EventEmitter<number> = new EventEmitter<number>();

  camposFiltrados: CampoModel[] = [];

  nombreCampo: string = '';
  usuariosFiltrados: UsuariosPorCongregacionInterface[] = [];
  selectedContact: number | null;
  tableSize: number = 50;

  cargando: boolean = true;
  congregaciones: CongregacionModel[] = [];
  congregacionesFiltradas: CongregacionModel[] = [];
  congregacionesFiltradasId: number[];

  pagina: number = 1;
  filtrarTexto: string = '';
  filtrarCongreTexto: string = '';
  filtrarPaisTexto: string = '';
  originalPais: string = '';
  originalCongre: string = '';
  filtrarCampoTexto: string = '';

  edadMinima: number | null = null;
  edadMaxima: number | null = null;

  paisSubscription: Subscription;
  campoSubscription: Subscription;
  usuarioSubscription: Subscription;
  congregacionSubscription: Subscription;

  isMobile: Observable<BreakpointState>;
  isFiltrosVisibles: boolean = false;

  // URL de las banderas desde environment
  banderasUrl: string = environment.banderas_url;

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.usuariosFiltrados = this.filterUsuarios(
      this.filterText,
      this.filtrarPaisTexto,
      this.filtrarCongreTexto,
      this.filtrarCampoTexto,
      this.edadMaxima,
      this.edadMinima,
    );
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  get paisesEnCenso(): string[] {
    const paisesUnicos = new Set<string>();
    this.usuariosFiltrados.forEach((usuario) => {
      const pais = usuario.usuarioCongregacionPais?.[0]?.pais;
      if (pais) {
        paisesUnicos.add(pais);
      }
    });
    return Array.from(paisesUnicos).sort();
  }

  obtenerColorPais(index: number): string {
    const colores = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary', 'bg-dark'];
    return colores[index % colores.length];
  }

  // Exponer las funciones de utils para uso en el template
  obtenerBanderaPais = obtenerBanderaPais;
  obtenerCodigoIsoPais = obtenerCodigoIsoPais;

  ngOnInit(): void {
    this.isMobile = this.breakpointService.observe(Breakpoints.Handset);
    this.cargarCongregaciones();
    this.cargarPaises();
    this.cargarCampos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarios']?.currentValue) {
      this.usuariosFiltrados = this.usuarios;

      this.nombrePais = this.usuarios[0]?.usuarioCongregacionPais?.[0]?.pais ?? '';
      this.nombreCongregacion = this.usuarios[0]?.usuarioCongregacionCongregacion?.[0]?.congregacion ?? '';
      this.nombreCampo = this.usuarios[0]?.usuarioCongregacionCampo?.[0]?.campo ?? '';
    }
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
    this.congregacionSubscription?.unsubscribe();
    this.paisSubscription?.unsubscribe();
    this.campoSubscription?.unsubscribe();
  }

  onTableDataChange(event: any) {
    this.pagina = event;
  }

  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.congregacionesFiltradas = congregaciones;
        this.cargando = false;
      });
  }

  cargarPaises() {
    this.cargando = true;
    this.paisSubscription = this.paisService.getPaises().subscribe((paises: CongregacionPaisModel[]) => {
      this.paises = paises;
      this.cargando = false;
    });
  }

  cargarCampos() {
    this.cargando = true;
    this.campoSubscription = this.campoService.getCampos().subscribe((campos: CampoModel[]) => {
      this.campos = campos;
      this.camposFiltrados = campos;
      this.cargando = false;
    });
  }

  // Métodos renombrados para evitar duplicados con los EventEmitter
  crearUsuarioHandler() {
    this.crearUsuario.emit();
  }

  actualizarUsuarioHandler(usuarioId: number) {
    this.actualizaUsuario.emit(usuarioId);
  }

  activarUsuarioHandler(usuarioId: number) {
    this.activarUsuario.emit(usuarioId);
  }

  enviarEmailHandler(usuarioId: number) {
    this.enviarEmail.emit(usuarioId);
  }

  borrarUsuarioHandler(usuario: UsuariosPorCongregacionInterface) {
    this.borrarUsuario.emit(usuario);
  }

  transcenderUsuarioHandler(id: number) {
    Swal.fire({
      title: 'Transcendió',
      text: '¿El feligrés transcendió?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: configuracion.CONFIRM_BUTTON_COLOR,
      cancelButtonColor: configuracion.CANCEL_BUTTON_COLOR,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.transcenderUsuario.emit(id);
      }
    });
  }

  toggleIcons(usuario: UsuariosPorCongregacionInterface) {
    this.selectedContact = this.selectedContact === usuario.id ? null : usuario.id;
  }

  filterUsuarios(
    filterTerm: string,
    pais: string,
    congregacion: string,
    campo: string,
    edadMaxima?: number,
    edadMinima?: number,
  ): UsuariosPorCongregacionInterface[] {
    const lowerFilterTerm = filterTerm.toLocaleLowerCase();
    const lowerPais = pais.toLocaleLowerCase();
    const lowerCongregacion = congregacion.toLocaleLowerCase();
    const lowerCampo = campo.toLocaleLowerCase();

    // Si no hay usuarios y los filtros están vacíos, devolvemos todos los usuarios
    if (this.usuarios.length === 0 && (lowerFilterTerm === '' || lowerPais === '' || lowerCongregacion === '')) {
      return this.usuarios;
    } else {
      return this.usuarios.filter((usuario: UsuariosPorCongregacionInterface) => {
        // Utilizamos una función de utilidad para convertir a minúsculas de forma segura
        const getSafeString = (value: string | undefined): string => (value ? value.toLocaleLowerCase() : '');

        // Concatenar el nombre completo del usuario
        const nombreCompleto = `${getSafeString(usuario.primerNombre)} ${getSafeString(
          usuario.segundoNombre,
        )} ${getSafeString(usuario.primerApellido)} ${getSafeString(usuario.segundoApellido)}`.trim();

        // Dividir el término de búsqueda en palabras individuales
        const searchTerms = lowerFilterTerm.split(' ');

        // Verificar que cada palabra en el término de búsqueda exista en el nombre completo
        const nombreCompletoMatches = searchTerms.every((term) => nombreCompleto.includes(term));

        const email = getSafeString(usuario.email);
        const numeroCelular = usuario.numeroCelular || '';

        const edadUsuario = this.calcularEdad(usuario.fechaNacimiento);
        const cumpleEdadMinima = edadMinima == null || edadUsuario >= edadMinima;
        const cumpleEdadMaxima = edadMaxima == null || edadUsuario <= edadMaxima;

        // Obtener los valores relacionados con la congregación, país y campo de forma segura
        const congregacion = usuario.usuarioCongregacionCongregacion?.[0]?.congregacion
          ? usuario.usuarioCongregacionCongregacion[0].congregacion.toLocaleLowerCase()
          : '';
        const pais = usuario.usuarioCongregacionPais?.[0]?.pais
          ? usuario.usuarioCongregacionPais[0].pais.toLocaleLowerCase()
          : '';
        const campo = usuario.usuarioCongregacionCampo?.[0]?.campo
          ? usuario.usuarioCongregacionCampo[0].campo.toLocaleLowerCase()
          : '';

        // Filtrar el usuario si alguna de las propiedades contiene el término de búsqueda
        return (
          (nombreCompletoMatches ||
            email.includes(lowerFilterTerm) ||
            numeroCelular.includes(lowerFilterTerm) ||
            usuario.id.toString().includes(lowerFilterTerm)) &&
          congregacion.includes(lowerCongregacion) &&
          pais.includes(lowerPais) &&
          campo.includes(lowerCampo) &&
          cumpleEdadMinima &&
          cumpleEdadMaxima
        );
      });
    }
  }

  filtrarCongregacionesPorPais(pais: string) {
    this.congregacionesFiltradas = this.congregaciones?.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais),
    );
  }

  filtrarCamposPorCongregacion(congre: string) {
    this.camposFiltrados = this.campos?.filter((camposBuscar) => camposBuscar.congregacion_id === parseInt(congre));
  }

  filtrarCamposPorPais() {
    this.congregacionesFiltradasId = [];
    for (let i = 0; i < this.congregacionesFiltradas.length; i++) {
      this.congregacionesFiltradasId.push(this.congregacionesFiltradas[i].id);
    }
    this.camposFiltrados = this.campos?.filter((campoBuscar) =>
      this.congregacionesFiltradasId.includes(campoBuscar.congregacion_id),
    );
  }

  filtrarPais(value: any) {
    this.filtrarCongreTexto = '';
    this.filtrarCampoTexto = '';
    if (value.pais === undefined) {
      this.filtrarPaisTexto = '';
      this.congregacionesFiltradas = this.congregaciones;
      this.camposFiltrados = this.campos;
    } else {
      this.originalPais = value.pais;
      this.filtrarPaisTexto = value.pais;
      this.filtrarCongregacionesPorPais(value.id);
      this.filtrarCamposPorPais();
    }
    this.usuariosFiltrados = this.filterUsuarios(
      this.filterText,
      this.filtrarPaisTexto,
      this.filtrarCongreTexto,
      this.filtrarCampoTexto,
      this.edadMaxima,
      this.edadMinima,
    );

    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  filtrarCongregacion(value: any) {
    this.filtrarCampoTexto = '';
    if (value.congregacion === undefined) {
      this.filtrarCongreTexto = '';
      this.camposFiltrados = this.campos;
    } else {
      this.originalCongre = value.congregacion;
      this.filtrarCongreTexto = value.congregacion;
      this.filtrarCamposPorCongregacion(value.id);
    }
    this.usuariosFiltrados = this.filterUsuarios(
      this.filterText,
      this.filtrarPaisTexto,
      this.filtrarCongreTexto,
      this.filtrarCampoTexto,
      this.edadMaxima,
      this.edadMinima,
    );
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  filtrarCampo(value: string) {
    this.filtrarCampoTexto = value;
    this.usuariosFiltrados = this.filterUsuarios(
      this.filterText,
      this.filtrarPaisTexto,
      this.filtrarCongreTexto,
      this.filtrarCampoTexto,
      this.edadMaxima,
      this.edadMinima,
    );
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  filtrarPorEdad() {
    // Si ambos campos están vacíos, reiniciar la lista filtrada
    if (
      (this.edadMinima === null || this.edadMinima === undefined) &&
      (this.edadMaxima === null || this.edadMaxima === undefined)
    ) {
      this.usuariosFiltrados = [...this.usuarios]; // Restaurar lista original
      this.totalUsuarios = this.usuariosFiltrados.length; // Actualizar total
      this.pagina = 1; // Reiniciar la página a la primera
      return;
    }

    // Si ambos valores están definidos, realizar el filtrado
    if (
      this.edadMinima !== null &&
      this.edadMinima !== undefined &&
      this.edadMaxima !== null &&
      this.edadMaxima !== undefined
    ) {
      this.usuariosFiltrados = this.filterUsuarios(
        this.filterText,
        this.filtrarPaisTexto,
        this.filtrarCongreTexto,
        this.filtrarCampoTexto,
        this.edadMaxima,
        this.edadMinima,
      );

      // Actualizar total y reiniciar la página
      this.totalUsuarios = this.usuariosFiltrados.length;
      this.pagina = 1;
    }
  }

  resetFiltros() {
    if (!this.usuarios || this.usuarios.length === 0) {
      return; // Si no hay usuarios, no realiza ninguna operación
    }

    // Reinicia los filtros a sus valores iniciales
    this.originalPais = '';
    this.originalCongre = '';
    this.filtrarPaisTexto = '';
    this.filtrarCongreTexto = '';
    this.filtrarCampoTexto = '';
    this.filterText = '';
    this.edadMinima = null;
    this.edadMaxima = null;

    // Restaura la lista completa sin cálculos adicionales
    this.usuariosFiltrados = [...this.usuarios];

    // Actualiza los contadores y reinicia la paginación
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  esconderFiltros() {
    this.isFiltrosVisibles = !this.isFiltrosVisibles;
  }

  obtenerNombresMinisterios(ministerios: MinisterioModel[]): string {
    const nombresMinisterios = ministerios.map((ministerio) => ministerio.ministerio);
    const nombresOrdenados = nombresMinisterios.sort((a, b) => a.localeCompare(b));
    return nombresOrdenados.join(', ');
  }

  obtenerNombresVoluntariados(voluntarios: VoluntariadoModel[]): string {
    const nombresVoluntariados = voluntarios.map((voluntario) => voluntario.nombreVoluntariado);
    const nombresOrdenados = nombresVoluntariados.sort((a, b) => a.localeCompare(b));
    return nombresOrdenados.join(', ');
  }

  exportarDatosFiltrados(): void {
    const datosParaExportar = this.usuariosFiltrados.map((usuario) => ({
      ID: usuario.id,
      Nombre: `${usuario.primerNombre} ${usuario.segundoNombre || ''} ${usuario.primerApellido} ${
        usuario.segundoApellido || ''
      }`,
      'Estado Civil': usuario.estadoCivil?.estadoCivil || 'N/A',
      Apodo: usuario.apodo || 'N/A',
      Edad: this.calcularEdad(usuario.fechaNacimiento),
      'Fecha Nacimiento': usuario.fechaNacimiento,
      'Es Joven': usuario.esJoven ? 'Sí' : 'No',
      Email: usuario.email || 'N/A',
      Celular: usuario.numeroCelular || 'N/A',
      'Congregación País': usuario.usuarioCongregacionPais?.[0]?.pais || 'N/A',
      Congregación: usuario.usuarioCongregacionCongregacion?.[0]?.congregacion || 'N/A',
      Campo: usuario.usuarioCongregacionCampo?.[0]?.campo || 'N/A',
      Direccion: usuario.direccion || '',
      'Departamento/Estado/Provincia': usuario.departamentoDireccion || '',
      'Ciudad Direccion': usuario.ciudadDireccion || '',
      'Codigo Postal Direccion': usuario.codigoPostalDireccion || '',
      'Pais Direccion': usuario.paisDireccion || '',
    }));

    this.exportarExcelService.exportToExcel(datosParaExportar, this.nombreArchivo);
  }

  masInformacion(idusuario: number) {
    this.usuarioSubscription = this.usuarioService.getUsuario(idusuario).subscribe((respuesta: UsuarioInterface) => {
      const usuario = respuesta.usuario;

      const numeroMita = usuario.id;
      const fechaDeNacimiento = usuario.fechaNacimiento;
      const nombre = `${usuario?.primerNombre} ${usuario?.segundoNombre} ${usuario?.primerApellido} ${usuario?.segundoApellido}`;
      const apodo = usuario.apodo ? usuario.apodo : '';
      const email = usuario.email ? usuario.email : '';
      const genero = usuario.genero?.genero ? usuario.genero.genero : '';
      const estadoCivil = usuario.estadoCivil?.estadoCivil ? usuario.estadoCivil.estadoCivil : '';
      const nacionalidad = usuario.nacionalidad?.nombre ? usuario.nacionalidad?.nombre : '';
      const rolEnCasa = usuario.rolCasa?.rolCasa ? usuario.rolCasa.rolCasa : '';
      const celular = usuario.numeroCelular ? usuario.numeroCelular : '';
      const telefonoCasa = usuario.telefonoCasa ? usuario.telefonoCasa : '';
      const direccion = `${usuario?.direccion}, ${usuario?.ciudadDireccion},  ${usuario?.departamentoDireccion}, ${usuario?.paisDireccion}, ${usuario?.codigoPostalDireccion}`;
      const direccionPostal = usuario?.direccionPostal
        ? `${usuario?.direccionPostal}, ${usuario?.ciudadPostal}, ${usuario?.departamentoPostal}, ${usuario?.paisPostal}, ${usuario?.codigoPostal}`
        : '';
      const gradoAcademico = usuario.gradoAcademico?.gradoAcademico ? usuario.gradoAcademico.gradoAcademico : '';
      const ocupacion = usuario.ocupacion || '';
      const especializacionEmpleo = usuario.especializacionEmpleo ? usuario.especializacionEmpleo : '';
      const tipoMiembro = usuario.tipoMiembro?.miembro ? usuario.tipoMiembro.miembro : '';
      const esjoven = usuario.esJoven ? 'Sí' : 'No';
      const ministerio = usuario.usuarioMinisterio ? this.obtenerNombresMinisterios(usuario.usuarioMinisterio) : false;
      const voluntario = usuario.usuarioVoluntariado
        ? this.obtenerNombresVoluntariados(usuario.usuarioVoluntariado)
        : '';

      const congregacionPais = usuario.usuarioCongregacionPais?.[0]?.pais
        ? usuario.usuarioCongregacionPais[0].pais
        : '';

      const congreacionCiudad = usuario.usuarioCongregacionCongregacion?.[0]?.congregacion
        ? usuario.usuarioCongregacionCongregacion[0].congregacion
        : '';

      const congregacionCampo = usuario.usuarioCongregacionCampo?.[0]?.campo
        ? usuario.usuarioCongregacionCampo[0].campo
        : '';

      const tipoDeDocumento = usuario?.tipoDocumento?.documento
        ? usuario.tipoDocumento.documento
        : TIPO_DOCUMENTO_ID.SIN_DOCUMENTO;
      const numeroDocumento = usuario?.numeroDocumento ? usuario?.numeroDocumento : '';
      const anoConocimiento = usuario?.anoConocimiento ? usuario?.anoConocimiento : '';

      Swal.fire({
        icon: 'info',
        text: `${nombre}`,
        html: ` <table class="table table-hover text-start">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Valor</th>

                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                      <td class="col-md-5"># Mita:</td>
                      <td class="col-md-7">${numeroMita}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Nombre:</td>
                      <td class="col-md-7">${nombre}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Apodo:</td>
                      <td class="col-md-7">${apodo}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Email:</td>
                      <td class="col-md-7">
                      ${email}
                      </td>
                    </tr>
                    <tr>
                    <td class="col-md-5">Género:</td>
                      <td class="col-md-7">${genero}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Estado Civil:</td>
                      <td class="col-md-7">${estadoCivil}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">País de Nacimiento:</td>
                      <td class="col-md-7">${nacionalidad}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Rol en Casa:</td>
                      <td class="col-md-7">${rolEnCasa}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Celular:</td>
                      <td class="col-md-7">${celular}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Teléfono de la Casa:</td>
                      <td class="col-md-7">${telefonoCasa}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Dirección de Residencia:</td>
                      <td class="col-md-7">${direccion}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Dirección Postal:</td>
                      <td class="col-md-7">${direccionPostal}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">¿Cuál es el grado académico más alto alcanzado?:</td>
                      <td class="col-md-7">${gradoAcademico}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Profesión y/o Ocupación:</td>
                      <td class="col-md-7">${ocupacion}</td>
                    </tr>
                      <tr>
                      <td class="col-md-5">Especialización de empleo:</td>
                      <td class="col-md-7">${especializacionEmpleo}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Informacion eclesiástica:</td>
                      <td class="col-md-7">${tipoMiembro}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Es Joven:</td>
                      <td class="col-md-7">${esjoven}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Ministerios:</td>
                      <td class="col-md-7">${ministerio}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Voluntariados:</td>
                      <td class="col-md-7">${voluntario}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Congregación País:</td>
                      <td class="col-md-7">${congregacionPais}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Congregación Ciudad:</td>
                      <td class="col-md-7">${congreacionCiudad}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Congregación Campo:</td>
                      <td class="col-md-7">${congregacionCampo}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Año que conoció la iglesia:</td>
                      <td class="col-md-7">${anoConocimiento}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Tipo de Documento:</td>
                      <td class="col-md-7">${tipoDeDocumento}</td>
                    </tr>
                    <tr>
                      <td class="col-md-5">Número de Documento:</td>
                      <td class="col-md-7">${numeroDocumento}</td>
                    </tr>
                     <tr>
                      <td class="col-md-5">Fecha de Nacimiento:</td>
                      <td class="col-md-7">${fechaDeNacimiento}</td>
                    </tr>
                  </tbody>
                </table>`,

        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
      });
    });
  }

  transferirUsuarioHandler(id: number): void {
    Swal.fire({
      title: 'Transferir Feligrés',
      html: `
        <div class="form-group mb-3">
          <label for="swalPais" class="form-label">Congregación País</label>
          <select id="swalPais" class="form-select">
            <option value="">Seleccione País</option>
            <option value="${CONGREGACION_ID.SIN_CONGREGACION_PAIS}">Sin Congregación País</option>
            ${this.paises.map((pais) => `<option value="${pais.id}">${pais.pais}</option>`).join('')}
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="swalCongregacion" class="form-label">Congregación Ciudad</label>
          <select id="swalCongregacion" class="form-select">
            <option value="">Seleccione Congregación</option>
            <option value="${CONGREGACION_ID.SIN_CONGREGACION_CIUDAD}">Sin Congregación Ciudad</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="swalCampo" class="form-label">Congregación Campo</label>
          <select id="swalCampo" class="form-select">
            <option value="">Seleccione Campo</option>
            <option value="${CONGREGACION_ID.SIN_CONGREGACION_CAMPO}">Sin Campo</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      didOpen: () => {
        const paisSelect = document.getElementById('swalPais') as HTMLSelectElement;
        const congregacionSelect = document.getElementById('swalCongregacion') as HTMLSelectElement;
        const campoSelect = document.getElementById('swalCampo') as HTMLSelectElement;

        // Evento para filtrar congregaciones al cambiar de país
        paisSelect.addEventListener('change', () => {
          const paisId = paisSelect.value;
          const congregacionesFiltradas = this.congregaciones.filter((c) => c.pais_id === Number(paisId));
          congregacionSelect.innerHTML = `
            <option value="">Seleccione Congregación</option>
            <option value="${CONGREGACION_ID.SIN_CONGREGACION_CIUDAD}">Sin Congregación Ciudad</option>
          `;
          congregacionesFiltradas.forEach((c) => {
            congregacionSelect.innerHTML += `<option value="${c.id}">${c.congregacion}</option>`;
          });
          campoSelect.innerHTML = `
            <option value="">Seleccione Campo</option>
            <option value="${CONGREGACION_ID.SIN_CONGREGACION_CAMPO}">Sin Campo</option>
          `;
        });

        // Evento para filtrar campos al cambiar de congregación
        congregacionSelect.addEventListener('change', () => {
          const congregacionId = congregacionSelect.value;
          const camposFiltrados = this.campos.filter((c) => c.congregacion_id === Number(congregacionId));
          campoSelect.innerHTML = `
            <option value="">Seleccione Campo</option>
            <option value="${CONGREGACION_ID.SIN_CONGREGACION_CAMPO}">Sin Campo</option>
          `;
          camposFiltrados.forEach((c) => {
            campoSelect.innerHTML += `<option value="${c.id}">${c.campo}</option>`;
          });
        });
      },
      preConfirm: () => {
        const pais = (document.getElementById('swalPais') as HTMLSelectElement).value;
        const congregacion = (document.getElementById('swalCongregacion') as HTMLSelectElement).value;
        const campo = (document.getElementById('swalCampo') as HTMLSelectElement).value;

        if (!pais || !congregacion || !campo) {
          Swal.showValidationMessage('Por favor complete todos los campos');
        }

        return { pais: Number(pais), congregacion: Number(congregacion), campo: Number(campo) };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.transferirUsuario.emit({ ...result.value, id });
        Swal.fire('Procesando...', 'Enviando la información al servidor.', 'info');
      }
    });
  }
}
