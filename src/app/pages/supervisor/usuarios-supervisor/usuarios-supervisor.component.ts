import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { usuariosSupervisorModel } from 'src/app/core/models/usuarios-supervisor.model';
import { RUTAS } from 'src/app/routes/menu-items';
import { SupervisorCongregacionService } from 'src/app/services/supervisorCongregacion/supervisor-congregacion.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-usuarios-supervisor',
  templateUrl: './usuarios-supervisor.component.html',
  styleUrls: ['./usuarios-supervisor.component.scss'],
})
export class UsuariosSupervisorComponent implements OnInit {
  public usuarios: usuariosSupervisorModel[] = [];

  public idSupervisor: number;

  public usuariosTemporales: usuariosSupervisorModel[] = [];

  public paginaDesde: number = 0;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  public cargando: boolean = true;

  // Subscription
  public usuarioSubscription: Subscription;
  public paisSubscription: Subscription;
  public congregacionSubscription: Subscription;
  public campoSubscription: Subscription;

  constructor(
    private router: Router,
    private supervisorCongregacionService: SupervisorCongregacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.idSupervisor = this.usuarioService.usuarioId;
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.supervisorCongregacionService.getUsuariosSupervisor(this.idSupervisor).subscribe((usuarios) => {
      this.usuarios = usuarios;
      this.usuariosTemporales = usuarios;
      this.cargando = false;
    });
  }

  actualizarUsuario(id: number) {
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${id}`);
  }

  crearUsuario() {
    const nuevo = 'nuevo';
    this.router.navigateByUrl(`${RUTAS.SISTEMA}/${RUTAS.USUARIOS}/${nuevo}`);
  }
}
