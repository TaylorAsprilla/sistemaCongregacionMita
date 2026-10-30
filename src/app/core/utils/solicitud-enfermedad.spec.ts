import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validarSolicitudEnfermedad } from './solicitud-enfermedad';

describe('Solicitud por enfermedad', () => {
  const campos = ['personaEncamada', 'enfermedadCronica', 'personaInmunosuprimida', 'impedimentoSalirCasa'];
  const formulario = (mascara: number) => new FormGroup(
    Object.fromEntries(campos.map((campo, indice) => [
      campo, new FormControl(Boolean(mascara & (1 << indice)), Validators.required),
    ])),
    validarSolicitudEnfermedad,
  );

  it('bloquea las cuatro respuestas No y acepta las otras 15 combinaciones', () => {
    expect(formulario(0).hasError('enfermedadNoElegible')).toBeTrue();
    for (let mascara = 1; mascara < 16; mascara++) {
      expect(formulario(mascara).valid).toBeTrue();
    }
  });

  it('exige responder todas las preguntas aunque alguna sea Sí', () => {
    const form = formulario(15);
    for (const campo of campos) {
      form.get(campo)?.setValue(null);
      expect(form.valid).toBeFalse();
      form.get(campo)?.setValue(true);
    }
  });

  it('recalcula la regla al cambiar una respuesta', () => {
    const form = formulario(0);
    form.get('personaInmunosuprimida')?.setValue(true);
    expect(form.valid).toBeTrue();
    form.get('personaInmunosuprimida')?.setValue(false);
    expect(form.hasError('enfermedadNoElegible')).toBeTrue();
  });
});
