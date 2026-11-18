import { Injectable } from '@angular/core';

/**
 * Punto único para abrir el selector de fotografía desde cualquier pantalla
 * (avatar del menú, perfil, aviso de bienvenida…) sin navegar al perfil.
 *
 * `FotoPerfilDialogoComponent` se registra una vez en el layout autenticado.
 * La apertura es síncrona para conservar el gesto del usuario: los navegadores
 * (sobre todo Safari) solo permiten abrir el selector de archivos desde un clic directo.
 */
@Injectable({ providedIn: 'root' })
export class FotoPerfilDialogoService {
  private apertura: (() => void) | null = null;

  registrar(apertura: () => void): () => void {
    this.apertura = apertura;
    return () => {
      if (this.apertura === apertura) this.apertura = null;
    };
  }

  /** @returns true si había un diálogo disponible. */
  abrirSelector(): boolean {
    if (!this.apertura) return false;
    this.apertura();
    return true;
  }
}
