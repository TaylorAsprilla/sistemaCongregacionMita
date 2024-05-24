import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { delay } from 'rxjs/operators';
import { PaisService } from 'src/app/services/pais/pais.service';
import { CampoService } from 'src/app/services/campo/campo.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-ver-censo',
  templateUrl: './ver-censo.component.html',
  styleUrls: ['./ver-censo.component.scss'],
})
export class VerCensoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() usuarios: UsuariosPorCongregacionInterface[] = [];
  @Input() campos: CampoModel[] = [];

  @Input() paises: CongregacionPaisModel[] = [];
  @Input() totalUsuarios: number = 0;

  @Input() nombreCongregacion: string = '';
  @Input() nombreArchivo: string = '';
  @Input() ocultarNombreCampo: boolean = false;
  @Input() titulo: string = '';

  @Output() onCrearUsuario = new EventEmitter<void>();
  @Output() onActualizaUsuario: EventEmitter<number> = new EventEmitter<number>();
  @Output() onActivarUsuario: EventEmitter<number> = new EventEmitter<number>();
  @Output() onBorrarUsuario: EventEmitter<UsuariosPorCongregacionInterface> =
    new EventEmitter<UsuariosPorCongregacionInterface>();

  camposFiltrados: CampoModel[] = [];

  nombrePais: string = '';
  nombreCampo: string = '';
  usuariosFiltrados: UsuariosPorCongregacionInterface[] = [];
  selectedContact: number;
  tableSize: number = 50;

  cargando: boolean = true;
  paisSubscription: Subscription;
  campoSubscription: Subscription;
  congregaciones: CongregacionModel[] = [];
  congregacionesFiltradas: CongregacionModel[] = [];
  congregacionesFiltradasId: number[];
  congregacionSubscription: Subscription;

  pagina: number = 1;
  filtrarTexto: string = '';
  filtrarCongreTexto: string = '';
  filtrarPaisTexto: string = '';
  originalPais: string = '';
  originalCongre: string = '';
  filtrarCampoTexto: string = '';

  usuarioSubscription: Subscription;

  isMobile: Observable<BreakpointState>;
  isFiltrosVisibles: boolean = false;

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.usuariosFiltrados = this.filterUsuarios(
      this.filterText,
      this.filtrarPaisTexto,
      this.filtrarCongreTexto,
      this.filtrarCampoTexto
    );
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  constructor(
    private usuarioService: UsuarioService,
    private paisService: PaisService,
    private congregacionService: CongregacionService,
    private campoService: CampoService,
    private breakpointService: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.isMobile = this.breakpointService.observe(Breakpoints.Handset);
    this.cargarCongregaciones();
    this.cargarPaises();
    this.cargarCampos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarios']?.currentValue) {
      this.usuariosFiltrados = this.usuarios;
      this.nombrePais = this.usuarios[0]?.usuarioCongregacionPais[0]?.pais;
      this.nombreCongregacion = this.usuarios[0]?.usuarioCongregacionCongregacion[0]?.congregacion;
      this.nombreCampo = this.usuarios[0]?.usuarioCongregacionCampo[0]?.campo;
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
      .pipe(delay(100))
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.congregacionesFiltradas = congregaciones;
        this.cargando = false;
      });
  }

  cargarPaises() {
    this.cargando = true;
    this.paisSubscription = this.paisService
      .getPaises()
      .pipe(delay(100))
      .subscribe((paises: CongregacionPaisModel[]) => {
        this.paises = paises;
        this.cargando = false;
      });
  }

  cargarCampos() {
    this.cargando = true;
    this.campoSubscription = this.campoService
      .getCampos()
      .pipe(delay(100))
      .subscribe((campos: CampoModel[]) => {
        this.campos = campos;
        this.camposFiltrados = campos;
        this.cargando = false;
      });
  }

  crearUsuario() {
    this.onCrearUsuario.emit();
  }

  actualizarUsuario(usuarioId: number) {
    this.onActualizaUsuario.emit(usuarioId);
  }

  activarUsuario(usuarioId: number) {
    this.onActivarUsuario.emit(usuarioId);
  }

  borrarUsuario(usuario: UsuariosPorCongregacionInterface) {
    this.onBorrarUsuario.emit(usuario);
  }

  toggleIcons(usuario: UsuariosPorCongregacionInterface) {
    this.selectedContact = this.selectedContact === usuario.id ? null : usuario.id;
  }

  filterUsuarios(
    filterTerm: string,
    country: string,
    congre: string,
    camp: string
  ): UsuariosPorCongregacionInterface[] {
    country = country.toLocaleLowerCase();

    congre = congre.toLocaleLowerCase();
    camp = camp.toLocaleLowerCase();
    filterTerm = filterTerm.toLocaleLowerCase();
    if (this.usuarios.length === 0 && (filterTerm === '' || country === '' || congre === '')) {
      return this.usuarios;
    } else {
      return this.usuarios.filter((usuario: UsuariosPorCongregacionInterface) => {
        const primerNombre = usuario.primerNombre ? usuario.primerNombre.toLocaleLowerCase() : '';
        const primerApellido = usuario.primerApellido ? usuario.primerApellido.toLocaleLowerCase() : '';
        const segundoApellido = usuario.segundoApellido ? usuario.segundoApellido.toLocaleLowerCase() : '';
        const email = usuario.email ? usuario.email.toLocaleLowerCase() : '';
        const congregacion = usuario.usuarioCongregacionCongregacion[0].congregacion
          ? usuario.usuarioCongregacionCongregacion[0].congregacion.toLocaleLowerCase()
          : '';
        const pais = usuario.usuarioCongregacionPais[0].pais
          ? usuario.usuarioCongregacionPais[0].pais.toLocaleLowerCase()
          : '';
        const campo = usuario.usuarioCongregacionCampo[0].campo
          ? usuario.usuarioCongregacionCampo[0].campo.toLocaleLowerCase()
          : '';
        const numeroCelular = usuario.numeroCelular ? usuario.numeroCelular : '';

        // Filtrar el usuario si alguna de las propiedades contiene el término de búsqueda
        return (
          (primerNombre.includes(filterTerm) ||
            primerApellido.includes(filterTerm) ||
            segundoApellido.includes(filterTerm) ||
            email.includes(filterTerm) ||
            numeroCelular.includes(filterTerm) ||
            usuario.id.toString().includes(filterTerm)) &&
          congregacion.includes(congre) &&
          pais.includes(country) &&
          campo.includes(camp)
        );
      });
    }
  }

  filtrarCongregacionesPorPais(pais: string) {
    this.congregacionesFiltradas = this.congregaciones?.filter(
      (congregacionBuscar) => congregacionBuscar.pais_id === parseInt(pais)
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
      this.congregacionesFiltradasId.includes(campoBuscar.congregacion_id)
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
      this.filtrarCampoTexto
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
      this.filtrarCampoTexto
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
      this.filtrarCampoTexto
    );
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  resetFiltros() {
    this.originalPais = '';
    this.originalCongre = '';
    this.filtrarCampoTexto = '';
    this.filterText = '';
    this.usuariosFiltrados = this.usuarios;
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

  masInformacion(idusuario: number) {
    this.usuarioSubscription = this.usuarioService.getUsuario(idusuario).subscribe((respuesta: UsuarioInterface) => {
      const usuario = respuesta.usuario;

      const numeroMita = usuario.id;
      const fechaDeNacimiento = usuario.fechaNacimiento ? usuario.fechaNacimiento : null;
      const nombre = `${usuario?.primerNombre} ${usuario?.segundoNombre} ${usuario?.primerApellido} ${usuario?.segundoApellido}`;
      const apodo = usuario.apodo ? usuario.apodo : '';
      const email = usuario.email ? usuario.email : '';
      const genero = usuario.genero.estado ? usuario.genero.genero : '';
      const estadoCivil = usuario.estadoCivil.estadoCivil ? usuario.estadoCivil.estadoCivil : '';
      const nacionalidad = usuario.nacionalidad?.nombre ? usuario.nacionalidad?.nombre : '';
      const rolEnCasa = usuario.rolCasa.rolCasa ? usuario.rolCasa.rolCasa : '';
      const celular = usuario.numeroCelular ? usuario.numeroCelular : '';
      const telefonoCasa = usuario.telefonoCasa ? usuario.telefonoCasa : '';
      const direccion = `${usuario?.direccion}, ${usuario?.ciudadDireccion},  ${usuario?.departamentoDireccion}, ${usuario?.paisDireccion}, ${usuario?.codigoPostalDireccion}`;
      const direccionPostal = usuario?.direccionPostal
        ? `${usuario?.direccionPostal}, ${usuario?.ciudadPostal}, ${usuario?.departamentoPostal}, ${usuario?.paisPostal}, ${usuario?.codigoPostal}`
        : '';
      const gradoAcademico = usuario.gradoAcademico.gradoAcademico ? usuario.gradoAcademico.gradoAcademico : '';
      const ocupacion = usuario.ocupacion || '';
      const especializacionEmpleo = usuario.especializacionEmpleo ? usuario.especializacionEmpleo : '';
      const tipoMiembro = usuario?.tipoMiembro.miembro ? usuario.tipoMiembro.miembro : '';
      const esjoven = usuario.esJoven ? 'Sí' : 'No';
      const ministerio = usuario.usuarioMinisterio ? this.obtenerNombresMinisterios(usuario.usuarioMinisterio) : false;
      const voluntario = usuario.usuarioVoluntariado
        ? this.obtenerNombresVoluntariados(usuario.usuarioVoluntariado)
        : '';
      const congregacionPais = usuario?.usuarioCongregacionPais[0]?.pais
        ? usuario?.usuarioCongregacionPais[0]?.pais
        : '';
      const congreacionCiudad = usuario?.usuarioCongregacionCongregacion[0]?.congregacion
        ? usuario?.usuarioCongregacionCongregacion[0]?.congregacion
        : '';
      const congregacionCampo = usuario?.usuarioCongregacionCampo[0]?.campo
        ? usuario?.usuarioCongregacionCampo[0]?.campo
        : '';
      const tipoDeDocumento = usuario?.tipoDocumento.documento
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
                      <td class="col-md-5">Ocupación:</td>
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
                      <td class="col-md-7">${new Date(fechaDeNacimiento).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>`,

        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
      });
    });
  }
}
