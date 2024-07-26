import { TIEMPO_SUGERIDO_DIAS, TIEMPO_SUGERIDO_TEXT } from '../../app/core/models/solicitud-multimedia.model';

export const configuracion = {
  inactividad: {
    // HH: MM: SS: MS
    INACTIVE_TIMEOUT_MS: 10 * 60 * 60 * 1000, // 10 horas en milisegundos
    TIMER_MODEL: 5 * 60 * 1000, // 5 minutos en milisegundos,
  },

  tiempoSugerido: [
    { value: TIEMPO_SUGERIDO_DIAS.QUINCE_DIAS, label: TIEMPO_SUGERIDO_TEXT.QUINCE_DIAS },
    { value: TIEMPO_SUGERIDO_DIAS.UN_MES, label: TIEMPO_SUGERIDO_TEXT.UN_MES },
    { value: TIEMPO_SUGERIDO_DIAS.SEIS_MESES, label: TIEMPO_SUGERIDO_TEXT.SEIS_MESES },
    { value: TIEMPO_SUGERIDO_DIAS.UN_ANO, label: TIEMPO_SUGERIDO_TEXT.UN_ANO },
    { value: TIEMPO_SUGERIDO_DIAS.DOS_ANOS, label: TIEMPO_SUGERIDO_TEXT.DOS_ANOS },
  ],

  avatarMasculino: 'assets/images/users/perfil.png',
  avatarFemenino: 'assets/images/users/perfil-mujer.png',
  logoMultimedia: 'assets/images/users/multimedia.jpg',
};
