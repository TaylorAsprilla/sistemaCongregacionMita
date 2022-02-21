import { Injectable } from '@angular/core';

export enum Role {
  ADMINISTRADOR = 'administrador',
  OBRERO = 'obrero',
  VOLUNTARIO = 'voluntario',
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu: any[] = [
    {
      titulo: 'Inicio',
      icono: 'fa fa-home',
      role: [Role.ADMINISTRADOR],
      submenu: [{ titulo: 'Inicio', url: '/' }],
    },
    {
      titulo: 'Administración',
      icono: 'fa fa-users',
      role: [Role.ADMINISTRADOR],
      submenu: [
        { titulo: 'Perfil', url: 'perfil' },
        { titulo: 'Usuarios', url: 'usuarios' },
        { titulo: 'Registro', url: '../registro' },
        { titulo: 'Ministerios', url: 'ministerios' },
        { titulo: 'Congregaciones', url: 'congregaciones' },
        { titulo: 'Campos', url: 'campos' },
        { titulo: 'Registrar Usuario', url: 'user' },
      ],
    },
  ];
  constructor() {}
}
