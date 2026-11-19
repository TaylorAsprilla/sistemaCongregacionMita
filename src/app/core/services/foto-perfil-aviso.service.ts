import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { FotoPerfilTourService } from './foto-perfil-tour.service';
import { FotoPerfilService } from './foto-perfil.service';
import { esFotoGestionada } from '../utils/foto-perfil';

const CLAVE = (usuarioId: number) => `fotoPerfilAviso:${usuarioId}`;

/**
 * Lanza el tour guiado que invita, una sola vez por usuario, a subir su fotografía.
 *
 * "Ya visto" se guarda en el servidor (así no se repite en otro navegador o equipo) y, como
 * respaldo y para evitar consultas, también en el navegador.
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
      // Sin almacenamiento disponible: se apoya solo en el servidor.
    }
  }

  /** Aviso al servidor sin bloquear: si falla, queda el respaldo local. */
  private registrarEnServidor(): void {
    this.fotoService.marcarTourVisto().subscribe({ error: () => undefined });
  }

  /** @returns true si el tour se inició. */
  async mostrarSiCorresponde(): Promise<boolean> {
    const usuario = this.usuarioService.usuario;
    if (!usuario?.id || this.usuarioService.isQRLogin || this.yaVisto(usuario.id)) {
      return false;
    }

    let respuesta;
    try {
      respuesta = await firstValueFrom(this.fotoService.consultarPropia());
    } catch {
      return false; // Sin certeza de lo que sabe el servidor, no se molesta al usuario.
    }

    if (respuesta.tourVisto === true) {
      this.marcarVisto(usuario.id); // Ya lo vio en otro navegador o equipo.
      return false;
    }
    if (esFotoGestionada(respuesta.foto)) {
      this.marcarVisto(usuario.id); // Ya tiene foto: no hace falta invitarle nunca.
      this.registrarEnServidor();
      return false;
    }

    // No se superpone a otro aviso (sesión, mensajes informativos…); se reintentará en el próximo ingreso.
    if (Swal.isVisible()) {
      return false;
    }

    this.marcarVisto(usuario.id);
    this.registrarEnServidor();
    this.tour.iniciar();
    return true;
  }
}
