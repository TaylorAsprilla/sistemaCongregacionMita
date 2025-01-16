import { TIEMPO_SUGERIDO_DIAS, TIEMPO_SUGERIDO_TEXT } from 'src/app/core/models/solicitud-multimedia.model';

export const configuracion = {
  inactividad: {
    // Tiempo de inactividad en milisegundos (10 horas)
    INACTIVE_TIMEOUT_MS: 10 * 60 * 60 * 1000,
    // Modelo de temporizador en milisegundos (5 minutos)
    TIMER_MODEL: 5 * 60 * 1000,
  },

  tiempoSugerido: [
    { value: TIEMPO_SUGERIDO_DIAS.QUINCE_DIAS, label: TIEMPO_SUGERIDO_TEXT.QUINCE_DIAS },
    { value: TIEMPO_SUGERIDO_DIAS.UN_MES, label: TIEMPO_SUGERIDO_TEXT.UN_MES },
    { value: TIEMPO_SUGERIDO_DIAS.SEIS_MESES, label: TIEMPO_SUGERIDO_TEXT.SEIS_MESES },
    { value: TIEMPO_SUGERIDO_DIAS.UN_ANO, label: TIEMPO_SUGERIDO_TEXT.UN_ANO },
    { value: TIEMPO_SUGERIDO_DIAS.DOS_ANOS, label: TIEMPO_SUGERIDO_TEXT.DOS_ANOS },
  ],

  // Rutas de imágenes
  avatarMasculino: 'assets/images/users/perfil.png',
  avatarFemenino: 'assets/images/users/perfil-mujer.png',
  logoMultimedia: 'assets/images/users/multimedia.jpg',

  // Colores de botones de confirmación y cancelación
  CONFIRM_BUTTON_COLOR: '#3085d6',
  CANCEL_BUTTON_COLOR: '#d33',
};
