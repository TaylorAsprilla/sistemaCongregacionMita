import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  totalUsuarios: number;

  usuariosSubscription: Subscription;
  constructor(private usuarioServices: UsuarioService) {}

  ngOnInit(): void {
    this.usuariosSubscription = this.usuarioServices.listarUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.totalUsuarios = totalUsuarios;
      this.usuarios = usuarios;
    });
  }

  ngOnDestroy(): void {
    this.usuariosSubscription?.unsubscribe();
  }
}
