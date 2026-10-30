import { AbstractControl, ValidationErrors } from '@angular/forms';

export const preguntasEnfermedad = [
  { campo: 'enfermedadCronica', texto: '¿Tienes una enfermedad aguda o crónica discapacitante?' },
  { campo: 'personaInmunosuprimida', texto: '¿Eres una persona inmunosuprimida?' },
  { campo: 'impedimentoSalirCasa', texto: '¿Sufres alguna condición de salud que te impida totalmente salir de tu casa?' },
] as const;

export function validarSolicitudEnfermedad(control: AbstractControl): ValidationErrors | null {
  const campos = ['personaEncamada', ...preguntasEnfermedad.map((pregunta) => pregunta.campo)];
  if (!campos.every((campo) => typeof control.get(campo)?.value === 'boolean')) return null;
  return campos.some((campo) => control.get(campo)?.value === true) ? null : { enfermedadNoElegible: true };
}
