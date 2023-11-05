import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public usuario: UsuarioModel;

  public primerNombre: string = '';
  public segundoNombre: string = '';
  public primerApellido: string = '';
  public segundoApellido: string = '';
  public email: string = '';
  public numeroCelular: string = '';

  get Rutas() {
    return RUTAS;
  }

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

    this.primerNombre = this.usuario?.primerNombre;
    this.segundoNombre = this.usuario?.segundoNombre;
    this.primerApellido = this.usuario?.primerApellido;
    this.segundoApellido = this.usuario?.segundoApellido;
    this.email = this.usuario?.email;
    this.numeroCelular = this.usuario?.numeroCelular;
  }

  ngAfterViewInit() {}

  logout() {
    this.usuarioService.logout();
  }

  redirigirAInicio() {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.INICIO}`);
  }
}
