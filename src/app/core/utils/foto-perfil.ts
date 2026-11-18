export const FOTO_PERFIL = {
  maxBytes: 5 * 1024 * 1024,
  minDimension: 200,
  salidaPx: 512,
  tipos: ['image/jpeg', 'image/png', 'image/webp'],
  aceptar: 'image/jpeg,image/png,image/webp',
} as const;

export type TipoImagenFoto = 'image/jpeg' | 'image/png' | 'image/webp';

export type ResultadoValidacionFoto =
  | { ok: true; tipo: TipoImagenFoto }
  | { ok: false; codigo: 'VACIO' | 'TAMANO' | 'FORMATO'; mensaje: string };

export const MENSAJES_FOTO = {
  formato: 'Formato de imagen no permitido. Use JPG, PNG o WEBP.',
  tamano: 'La imagen supera el tamaño máximo permitido de 5 MB.',
  dimension: `La imagen debe tener al menos ${FOTO_PERFIL.minDimension} x ${FOTO_PERFIL.minDimension} píxeles.`,
  corrupta: 'No se pudo leer la imagen. El archivo puede estar dañado.',
  vacio: 'El archivo está vacío.',
  subida: 'Error al cargar la fotografía.',
  actualizada: 'Fotografía actualizada correctamente.',
  eliminada: 'Fotografía eliminada correctamente.',
  eliminar: 'Error al eliminar la fotografía.',
} as const;

/** Identifica el formato por su firma binaria, ignorando extensión y MIME del navegador. */
export function detectarTipoImagen(bytes: Uint8Array): TipoImagenFoto | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && png.every((b, i) => bytes[i] === b)) {
    return 'image/png';
  }
  const ascii = (desde: number, texto: string) =>
    bytes.length >= desde + texto.length && [...texto].every((c, i) => bytes[desde + i] === c.charCodeAt(0));
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) {
    return 'image/webp';
  }
  return null;
}

export async function validarArchivoFoto(archivo: Blob): Promise<ResultadoValidacionFoto> {
  if (archivo.size === 0) {
    return { ok: false, codigo: 'VACIO', mensaje: MENSAJES_FOTO.vacio };
  }
  if (archivo.size > FOTO_PERFIL.maxBytes) {
    return { ok: false, codigo: 'TAMANO', mensaje: MENSAJES_FOTO.tamano };
  }
  const cabecera = new Uint8Array(await archivo.slice(0, 16).arrayBuffer());
  const tipo = detectarTipoImagen(cabecera);
  if (!tipo) {
    return { ok: false, codigo: 'FORMATO', mensaje: MENSAJES_FOTO.formato };
  }
  return { ok: true, tipo };
}

/** Hasta dos letras: inicial del primer nombre y del último apellido. */
export function iniciales(nombre?: string | null): string {
  const partes = (nombre ?? '')
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  if (partes.length === 0) return '?';
  const primera = partes[0].charAt(0);
  const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
  return (primera + ultima).toLocaleUpperCase('es');
}

export interface EstadoRecorte {
  anchoImagen: number;
  altoImagen: number;
  /** Lado en px del visor cuadrado donde se muestra el recorte. */
  visor: number;
  /** 1 = la imagen cubre justo el visor; mayor acerca. */
  zoom: number;
  /** Desplazamiento del centro de la imagen respecto al centro del visor, en px del visor. */
  desplazX: number;
  desplazY: number;
}

export interface RecorteOrigen {
  sx: number;
  sy: number;
  lado: number;
}

/** Escala base para que la imagen cubra el visor (modo "cover"). */
export function escalaBase(anchoImagen: number, altoImagen: number, visor: number): number {
  return visor / Math.min(anchoImagen, altoImagen);
}

/** Impide que el visor muestre bordes vacíos fuera de la imagen. */
export function limitarDesplazamiento(estado: EstadoRecorte): { x: number; y: number } {
  const escala = escalaBase(estado.anchoImagen, estado.altoImagen, estado.visor) * estado.zoom;
  const maxX = Math.max(0, (estado.anchoImagen * escala - estado.visor) / 2);
  const maxY = Math.max(0, (estado.altoImagen * escala - estado.visor) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, estado.desplazX)),
    y: Math.min(maxY, Math.max(-maxY, estado.desplazY)),
  };
}

/** Región cuadrada de la imagen original que corresponde a lo visible en el visor. */
export function calcularRecorte(estado: EstadoRecorte): RecorteOrigen {
  const escala = escalaBase(estado.anchoImagen, estado.altoImagen, estado.visor) * estado.zoom;
  const { x, y } = limitarDesplazamiento(estado);
  const lado = estado.visor / escala;
  const centroX = estado.anchoImagen / 2 - x / escala;
  const centroY = estado.altoImagen / 2 - y / escala;
  return { sx: centroX - lado / 2, sy: centroY - lado / 2, lado };
}
