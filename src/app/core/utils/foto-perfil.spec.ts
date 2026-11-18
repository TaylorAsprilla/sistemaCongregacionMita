import {
  FOTO_PERFIL,
  MENSAJES_FOTO,
  calcularRecorte,
  detectarTipoImagen,
  iniciales,
  limitarDesplazamiento,
  validarArchivoFoto,
} from './foto-perfil';

const bytes = (...valores: number[]) => new Uint8Array(valores);
const blobDe = (contenido: number[], tipo = 'image/jpeg') => new Blob([new Uint8Array(contenido)], { type: tipo });

describe('foto-perfil utils', () => {
  describe('detectarTipoImagen', () => {
    it('reconoce JPEG, PNG y WEBP por su firma', () => {
      expect(detectarTipoImagen(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg');
      expect(detectarTipoImagen(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe('image/png');
      const webp = [...'RIFF'].map((c) => c.charCodeAt(0)).concat([0, 0, 0, 0], [...'WEBP'].map((c) => c.charCodeAt(0)));
      expect(detectarTipoImagen(new Uint8Array(webp))).toBe('image/webp');
    });

    it('rechaza GIF, PDF y texto aunque se declaren como imagen', () => {
      expect(detectarTipoImagen(new TextEncoder().encode('GIF89a......'))).toBeNull();
      expect(detectarTipoImagen(new TextEncoder().encode('%PDF-1.7'))).toBeNull();
      expect(detectarTipoImagen(new TextEncoder().encode('<script>'))).toBeNull();
      expect(detectarTipoImagen(bytes())).toBeNull();
    });
  });

  describe('validarArchivoFoto', () => {
    it('acepta un archivo con firma válida', async () => {
      const r = await validarArchivoFoto(blobDe([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]));
      expect(r).toEqual({ ok: true, tipo: 'image/jpeg' });
    });

    it('rechaza por contenido aunque el MIME diga image/png', async () => {
      const falso = new Blob(['no soy una imagen'], { type: 'image/png' });
      const r = await validarArchivoFoto(falso);
      expect(r.ok).toBeFalse();
      if (r.ok === false) {
        expect(r.codigo).toBe('FORMATO');
        expect(r.mensaje).toBe(MENSAJES_FOTO.formato);
      }
    });

    it('rechaza archivos de más de 5 MB y vacíos', async () => {
      const grande = new Blob([new Uint8Array(FOTO_PERFIL.maxBytes + 1)], { type: 'image/jpeg' });
      const r = await validarArchivoFoto(grande);
      expect(r.ok === false && r.codigo).toBe('TAMANO');
      const vacio = await validarArchivoFoto(new Blob([]));
      expect(vacio.ok === false && vacio.codigo).toBe('VACIO');
    });
  });

  describe('iniciales', () => {
    it('usa primer nombre y último apellido', () => {
      expect(iniciales('Ana María López Pérez')).toBe('AP');
      expect(iniciales('  juan  ')).toBe('J');
      expect(iniciales('')).toBe('?');
      expect(iniciales(undefined)).toBe('?');
    });
  });

  describe('recorte', () => {
    const base = { anchoImagen: 800, altoImagen: 400, visor: 300, zoom: 1, desplazX: 0, desplazY: 0 };

    it('sin zoom ni desplazamiento recorta el cuadrado central de lado = lado menor', () => {
      const r = calcularRecorte(base);
      expect(r.lado).toBeCloseTo(400);
      expect(r.sx).toBeCloseTo(200);
      expect(r.sy).toBeCloseTo(0);
    });

    it('con zoom 2 el recorte cubre la mitad de la región', () => {
      const r = calcularRecorte({ ...base, zoom: 2 });
      expect(r.lado).toBeCloseTo(200);
      expect(r.sx).toBeCloseTo(300);
      expect(r.sy).toBeCloseTo(100);
    });

    it('no permite desplazarse fuera de la imagen', () => {
      // Imagen 800x400 en visor de 300: ancho mostrado 600, margen horizontal de (600-300)/2 = 150.
      expect(limitarDesplazamiento({ ...base, desplazX: 9999, desplazY: 9999 })).toEqual({ x: 150, y: 0 });
      const r = calcularRecorte({ ...base, desplazX: -9999 });
      expect(r.sx).toBeCloseTo(400); // borde derecho: 800 - 400
      expect(r.sx + r.lado).toBeLessThanOrEqual(800 + 1e-9);
    });

    it('siempre devuelve una región cuadrada dentro de la imagen', () => {
      for (const zoom of [1, 1.5, 3, 4]) {
        for (const d of [-500, -50, 0, 80, 700]) {
          const r = calcularRecorte({ ...base, zoom, desplazX: d, desplazY: d });
          expect(r.sx).toBeGreaterThanOrEqual(-1e-9);
          expect(r.sy).toBeGreaterThanOrEqual(-1e-9);
          expect(r.sx + r.lado).toBeLessThanOrEqual(base.anchoImagen + 1e-9);
          expect(r.sy + r.lado).toBeLessThanOrEqual(base.altoImagen + 1e-9);
        }
      }
    });
  });
});
