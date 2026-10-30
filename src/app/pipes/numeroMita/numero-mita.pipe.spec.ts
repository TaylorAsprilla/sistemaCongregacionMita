import { NumeroMitaPipe } from './numero-mita.pipe';
import { formatearNumeroMita } from '../../core/utils/numero-mita';

describe('NumeroMitaPipe', () => {
  const pipe = new NumeroMitaPipe();

  it('agrupa los numeros Mita con puntos desde cuatro digitos', () => {
    for (const [numero, esperado] of [
      [123, '123'],
      [1234, '1.234'],
      [12345, '12.345'],
      [1234567, '1.234.567'],
    ] as const) {
      expect(pipe.transform(numero)).toBe(esperado);
      expect(formatearNumeroMita(numero)).toBe(esperado);
    }
  });

  it('no muestra un numero cuando el usuario no ha cargado', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
