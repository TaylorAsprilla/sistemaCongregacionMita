import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import Swal from 'sweetalert2';
import { FotoPerfilDialogoService } from 'src/app/core/services/foto-perfil-dialogo.service';
import { FotoPerfilService } from 'src/app/core/services/foto-perfil.service';
import {
  EstadoRecorte,
  FOTO_PERFIL,
  MENSAJES_FOTO,
  calcularRecorte,
  escalaBase,
  limitarDesplazamiento,
  validarArchivoFoto,
} from 'src/app/core/utils/foto-perfil';

/** Lado (px de canvas) del visor de recorte. */
const VISOR = 300;
const ZOOM_MAX = 4;

/**
 * Selector + recorte + subida de la fotografía de perfil.
 * Se monta una sola vez en el layout autenticado y se abre con `FotoPerfilDialogoService`.
 */
@Component({
  selector: 'app-foto-perfil-dialogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './foto-perfil-dialogo.component.html',
  styleUrls: ['./foto-perfil-dialogo.component.scss'],
})
export class FotoPerfilDialogoComponent implements OnDestroy {
  private fotoService = inject(FotoPerfilService);
  private dialogoService = inject(FotoPerfilDialogoService);
  private destroyRef = inject(DestroyRef);

  protected readonly aceptar = FOTO_PERFIL.aceptar;
  protected readonly visor = VISOR;
  protected readonly zoomMax = ZOOM_MAX;

  private entrada = viewChild<ElementRef<HTMLInputElement>>('entradaArchivo');
  private lienzo = viewChild<ElementRef<HTMLCanvasElement>>('lienzo');

  protected editando = signal(false);
  protected subiendo = signal(false);
  protected progreso = signal(0);
  protected errorEdicion = signal<string | null>(null);
  protected zoom = signal(1);

  private imagen: HTMLImageElement | null = null;
  private urlObjeto: string | null = null;
  private desplazX = 0;
  private desplazY = 0;
  private arrastre: { x: number; y: number } | null = null;

  constructor() {
    const liberar = this.dialogoService.registrar(() => this.abrirSelector());
    this.destroyRef.onDestroy(liberar);

    effect(() => {
      // Redibuja cuando cambia el zoom o se abre el visor.
      this.zoom();
      if (this.editando() && this.lienzo()) {
        this.dibujar();
      }
    });
  }

  ngOnDestroy(): void {
    this.liberarImagen();
  }

  protected abrirSelector(): void {
    if (!this.subiendo() && !this.editando()) {
      this.entrada()?.nativeElement.click();
    }
  }

  protected async alSeleccionar(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = ''; // Permite volver a elegir el mismo archivo.
    if (!archivo) return;

    // Valida el contenido real (firma binaria), no la extensión ni el MIME del navegador.
    const validacion = await validarArchivoFoto(archivo);
    if (validacion.ok === false) {
      await this.avisarError(validacion.mensaje);
      return;
    }

    const url = URL.createObjectURL(archivo);
    try {
      const imagen = await this.cargarImagen(url);
      if (imagen.naturalWidth < FOTO_PERFIL.minDimension || imagen.naturalHeight < FOTO_PERFIL.minDimension) {
        URL.revokeObjectURL(url);
        await this.avisarError(MENSAJES_FOTO.dimension);
        return;
      }
      this.liberarImagen();
      this.imagen = imagen;
      this.urlObjeto = url;
    } catch {
      URL.revokeObjectURL(url);
      await this.avisarError(MENSAJES_FOTO.corrupta);
      return;
    }

    this.desplazX = 0;
    this.desplazY = 0;
    this.errorEdicion.set(null);
    this.progreso.set(0);
    this.zoom.set(1);
    this.editando.set(true);
  }

  protected cancelar(): void {
    if (this.subiendo()) return;
    this.cerrar();
  }

  protected async confirmar(): Promise<void> {
    if (!this.imagen || this.subiendo()) return;
    this.errorEdicion.set(null);

    const blob = await this.generarImagenRecortada();
    if (!blob) {
      this.errorEdicion.set(MENSAJES_FOTO.subida);
      return;
    }

    this.subiendo.set(true);
    this.progreso.set(0);
    this.fotoService.subir(blob).subscribe({
      next: (estado) => {
        this.progreso.set(estado.progreso);
        if (estado.resultado) {
          this.subiendo.set(false);
          this.cerrar();
          Swal.fire({ icon: 'success', title: 'Listo', text: MENSAJES_FOTO.actualizada, timer: 2500 });
        }
      },
      error: (error) => {
        this.subiendo.set(false);
        // Se conserva la fotografía anterior; el usuario puede reintentar sin volver a recortar.
        this.errorEdicion.set(this.fotoService.mensajeDeError(error, MENSAJES_FOTO.subida));
      },
    });
  }

  // ---- Interacción del visor (ratón, táctil y teclado) ----

  protected alPresionar(evento: PointerEvent): void {
    this.arrastre = { x: evento.clientX, y: evento.clientY };
    (evento.target as HTMLElement).setPointerCapture?.(evento.pointerId);
  }

  protected alMover(evento: PointerEvent): void {
    if (!this.arrastre) return;
    const lienzo = this.lienzo()?.nativeElement;
    if (!lienzo) return;
    // El canvas puede escalarse por CSS en pantallas pequeñas.
    const factor = VISOR / lienzo.getBoundingClientRect().width;
    this.desplazX += (evento.clientX - this.arrastre.x) * factor;
    this.desplazY += (evento.clientY - this.arrastre.y) * factor;
    this.arrastre = { x: evento.clientX, y: evento.clientY };
    this.dibujar();
  }

  protected alSoltar(): void {
    this.arrastre = null;
  }

  protected alRodar(evento: WheelEvent): void {
    evento.preventDefault();
    this.cambiarZoom(this.zoom() + (evento.deltaY < 0 ? 0.1 : -0.1));
  }

  protected alCambiarZoom(evento: Event): void {
    this.cambiarZoom(Number((evento.target as HTMLInputElement).value));
  }

  protected alTeclear(evento: KeyboardEvent): void {
    const paso = 10;
    const mapa: Record<string, [number, number]> = {
      ArrowLeft: [paso, 0],
      ArrowRight: [-paso, 0],
      ArrowUp: [0, paso],
      ArrowDown: [0, -paso],
    };
    if (evento.key === '+' || evento.key === '=') {
      this.cambiarZoom(this.zoom() + 0.1);
    } else if (evento.key === '-') {
      this.cambiarZoom(this.zoom() - 0.1);
    } else if (mapa[evento.key]) {
      this.desplazX += mapa[evento.key][0];
      this.desplazY += mapa[evento.key][1];
      this.dibujar();
    } else {
      return;
    }
    evento.preventDefault();
  }

  // ---- Utilidades privadas ----

  private cambiarZoom(valor: number): void {
    this.zoom.set(Math.min(ZOOM_MAX, Math.max(1, Math.round(valor * 100) / 100)));
  }

  private estado(): EstadoRecorte {
    return {
      anchoImagen: this.imagen!.naturalWidth,
      altoImagen: this.imagen!.naturalHeight,
      visor: VISOR,
      zoom: this.zoom(),
      desplazX: this.desplazX,
      desplazY: this.desplazY,
    };
  }

  private dibujar(): void {
    const lienzo = this.lienzo()?.nativeElement;
    const ctx = lienzo?.getContext('2d');
    if (!lienzo || !ctx || !this.imagen) return;

    const limitado = limitarDesplazamiento(this.estado());
    this.desplazX = limitado.x;
    this.desplazY = limitado.y;

    const escala = escalaBase(this.imagen.naturalWidth, this.imagen.naturalHeight, VISOR) * this.zoom();
    const ancho = this.imagen.naturalWidth * escala;
    const alto = this.imagen.naturalHeight * escala;

    ctx.clearRect(0, 0, VISOR, VISOR);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, VISOR, VISOR);
    ctx.drawImage(this.imagen, VISOR / 2 + this.desplazX - ancho / 2, VISOR / 2 + this.desplazY - alto / 2, ancho, alto);

    // Máscara circular: oscurece lo que quedará fuera de la fotografía de perfil.
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, VISOR, VISOR);
    ctx.arc(VISOR / 2, VISOR / 2, VISOR / 2 - 2, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.restore();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(VISOR / 2, VISOR / 2, VISOR / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  private generarImagenRecortada(): Promise<Blob | null> {
    if (!this.imagen) return Promise.resolve(null);
    const { sx, sy, lado } = calcularRecorte(this.estado());
    const salida = document.createElement('canvas');
    salida.width = FOTO_PERFIL.salidaPx;
    salida.height = FOTO_PERFIL.salidaPx;
    const ctx = salida.getContext('2d');
    if (!ctx) return Promise.resolve(null);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.imagen, sx, sy, lado, lado, 0, 0, FOTO_PERFIL.salidaPx, FOTO_PERFIL.salidaPx);
    // WebP cuando el navegador lo soporta; si no, devuelve PNG (el backend acepta ambos).
    return new Promise((resolver) => salida.toBlob((blob) => resolver(blob), 'image/webp', 0.9));
  }

  private cargarImagen(url: string): Promise<HTMLImageElement> {
    return new Promise((resolver, rechazar) => {
      const imagen = new Image();
      imagen.onload = () => resolver(imagen);
      imagen.onerror = () => rechazar(new Error('imagen no legible'));
      imagen.src = url;
    });
  }

  private cerrar(): void {
    this.editando.set(false);
    this.liberarImagen();
  }

  private liberarImagen(): void {
    if (this.urlObjeto) {
      URL.revokeObjectURL(this.urlObjeto);
      this.urlObjeto = null;
    }
    this.imagen = null;
    this.arrastre = null;
  }

  private avisarError(texto: string) {
    return Swal.fire({ icon: 'error', title: 'Error', text: texto });
  }
}
