import { LocalDatePipe } from './local-date.pipe';

describe('LocalDatePipe', () => {
  const pipe = new LocalDatePipe();

  it('muestra el dia en espanol sin desplazar una fecha sin hora', () => {
    expect(pipe.transform('2026-10-08', 'weekday')).toBe('jueves');
    expect(pipe.transform('2026-10-11', 'weekday')).toBe('domingo');
  });

  it('conserva el formato de fecha existente', () => {
    expect(pipe.transform('2026-10-08')).toBe(
      new Intl.DateTimeFormat(navigator.language, { dateStyle: 'short' }).format(new Date(2026, 9, 8)),
    );
  });

  it('no muestra un dia para una fecha ausente o invalida', () => {
    expect(pipe.transform(null, 'weekday')).toBe('');
    expect(pipe.transform('', 'weekday')).toBe('');
    expect(pipe.transform('invalid', 'weekday')).toBe('');
  });
});
