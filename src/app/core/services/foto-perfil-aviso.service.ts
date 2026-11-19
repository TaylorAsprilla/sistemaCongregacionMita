import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilTourService } from './foto-perfil-tour.service';
import { FotoPerfilService } from './foto-perfil.service';
import { esFotoGestionada } from '../utils/foto-perfil';

const CLAVE = (usuarioId: number) => `fotoPerfilAviso:${usuarioId}`;

/**
 * Lanza el tour guiado que invita, una sola vez por usuario y navegador, a subir su fotografía.
 * No se muestra a quien ya tiene foto, en sesiones QR/multimedia ni si hay otro aviso abierto.
 */
@Injectable({ providedIn: 'root' })
export class FotoPerfilAvisoService {
  private usuarioService = inject(UsuarioService);
  private fotoService = inject(FotoPerfilService);
  private tour = inject(FotoPerfilTourService);

  yaVisto(usuarioId: number): boolean {
    try {
      return localStorage.getItem(CLAVE(usuarioId)) === '1';
    } catch {
      return false;
    }
  }

  private marcarVisto(usuarioId: number): void {
    try {
      localStorage.setItem(CLAVE(usuarioId), '1');
    } catch {
      // Sin almacenamiento disponible: el aviso podría repetirse, pero no rompe nada.
    }
  }

  /** @returns true si el tour se inició. */
  async mostrarSiCorresponde(): Promise<boolean> {
    const usuario = this.usuarioService.usuario;
    if (!usuario?.id || this.usuarioService.isQRLogin || this.yaVisto(usuario.id)) {
      return false;
    }

    let foto = usuario.foto;
    if (foto === undefined) {
      try {
        foto = (await firstValueFrom(this.fotoService.consultarPropia())).foto;
      } catch {
        return false; // Sin certeza de que no tenga foto, no se molesta al usuario.
      }
    }
    if (esFotoGestionada(foto)) {
      this.marcarVisto(usuario.id); // Ya tiene foto: no hace falta invitarle nunca.
      return false;
    }

    // No se superpone a otro aviso (sesión, mensajes informativos…); se reintentará en el próximo ingreso.
    if (Swal.isVisible()) {
      return false;
    }

    this.marcarVisto(usuario.id);
    this.tour.iniciar();
    return true;
  }
}
