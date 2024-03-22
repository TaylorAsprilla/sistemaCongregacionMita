import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UsuariosPorCongregacionInterface } from 'src/app/core/interfaces/usuario.interface';
import { CampoModel } from 'src/app/core/models/campo.model';
import { CongregacionPaisModel } from 'src/app/core/models/congregacion-pais.model';

@Component({
  selector: 'app-ver-censo',
  templateUrl: './ver-censo.component.html',
  styleUrls: ['./ver-censo.component.scss'],
})
export class VerCensoComponent implements OnInit, OnChanges {
  @Input() usuarios: UsuariosPorCongregacionInterface[] = [];
  @Input() campos: CampoModel[] = [];
  @Input() paises: CongregacionPaisModel[] = [];
  @Input() totalUsuarios: number = 0;
  @Input() nombreCongregacion: string = '';
  @Input() nombreArchivo: string = '';

  @Output() onCrearUsuario = new EventEmitter<void>();
  @Output() onActualizaUsuario: EventEmitter<number> = new EventEmitter<number>();
  @Output() onActivarUsuario: EventEmitter<number> = new EventEmitter<number>();
  @Output() onBorrarUsuario: EventEmitter<UsuariosPorCongregacionInterface> =
    new EventEmitter<UsuariosPorCongregacionInterface>();

  usuariosFiltrados: UsuariosPorCongregacionInterface[] = [];
  selectedContact: number;
  tableSize: number = 50;

  pagina: number = 1;
  filtrarTexto: string = '';

  get filterText() {
    return this.filtrarTexto;
  }

  set filterText(value: string) {
    this.filtrarTexto = value;
    this.usuariosFiltrados = this.filterUsuarios(value);
    this.totalUsuarios = this.usuariosFiltrados.length;
    this.pagina = 1;
  }

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarios']?.currentValue) {
      this.usuariosFiltrados = this.usuarios;
    }
  }

  // pasar pagina
  onTableDataChange(event: any) {
    this.pagina = event;
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

  exportExcel() {}

  toggleIcons(usuario: UsuariosPorCongregacionInterface) {
    this.selectedContact = this.selectedContact === usuario.id ? null : usuario.id;
  }

  filterUsuarios(filterTerm: string): UsuariosPorCongregacionInterface[] {
    filterTerm = filterTerm.toLocaleLowerCase();
    if (this.usuarios.length.toString() === '0' || this.filterText === '') {
      return this.usuarios;
    } else {
      return this.usuarios.filter(
        (usuario: UsuariosPorCongregacionInterface) =>
          usuario.primerNombre.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          usuario.primerApellido.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          usuario.segundoApellido.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          usuario.email.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          usuario.congregacion.toLocaleLowerCase().indexOf(filterTerm) !== -1 ||
          usuario.numeroCelular.indexOf(filterTerm) !== -1 ||
          usuario.id.toString().indexOf(filterTerm) !== -1
      );
    }
  }
}
