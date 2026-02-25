/**
 * Utilidad para obtener la bandera emoji de un país
 * @param nombrePais - Nombre del país
 * @returns Emoji de la bandera del país o bandera genérica si no se encuentra
 */
export function obtenerBanderaPais(nombrePais: string): string {
  // Mapeo de países registrados en la plataforma
  const banderas: { [key: string]: string } = {
    Canadá: '🇨🇦',
    Colombia: '🇨🇴',
    'Costa Rica': '🇨🇷',
    'El Salvador': '🇸🇻',
    España: '🇪🇸',
    'Estados Unidos': '🇺🇸',
    Italia: '🇮🇹',
    México: '🇲🇽',
    Panamá: '🇵🇦',
    'Puerto Rico': '🇵🇷',
    Venezuela: '🇻🇪',
    'República Dominicana': '🇩🇴',
    Ecuador: '🇪🇨',
    Chile: '🇨🇱',
    'Sin Congregación País': '🌐',
  };

  return banderas[nombrePais] || '🌍';
}

/**
 * Obtiene el código ISO del país para banderas
 * @param nombrePais - Nombre del país
 * @returns Código ISO de 2 letras del país
 */
export function obtenerCodigoIsoPais(nombrePais: string): string {
  const codigosISO: { [key: string]: string } = {
    Canadá: 'CA',
    Colombia: 'CO',
    'Costa Rica': 'CR',
    'El Salvador': 'SV',
    España: 'ES',
    'Estados Unidos': 'US',
    Italia: 'IT',
    México: 'MX',
    Panamá: 'PA',
    'Puerto Rico': 'PR',
    Venezuela: 'VE',
    'República Dominicana': 'DO',
    Ecuador: 'EC',
    Chile: 'CL',
    'Sin Congregación País': '',
  };

  return codigosISO[nombrePais] || '';
}

/**
 * Obtiene todas las banderas disponibles
 * @returns Objeto con todos los países y sus banderas
 */
export function obtenerTodasLasBanderas(): { [key: string]: string } {
  return {
    Canadá: '🇨🇦',
    Colombia: '🇨🇴',
    'Costa Rica': '🇨🇷',
    'El Salvador': '🇸🇻',
    España: '🇪🇸',
    'Estados Unidos': '🇺🇸',
    Italia: '🇮🇹',
    México: '🇲🇽',
    Panamá: '🇵🇦',
    'Puerto Rico': '🇵🇷',
    Venezuela: '🇻🇪',
    'República Dominicana': '🇩🇴',
    Ecuador: '🇪🇨',
    Chile: '🇨🇱',
    'Sin Congregación País': '🌐',
  };
}

/**
 * Obtiene la lista de países soportados
 * @returns Array con los nombres de todos los países soportados
 */
export function obtenerPaisesSoportados(): string[] {
  return [
    'Canadá',
    'Colombia',
    'Costa Rica',
    'El Salvador',
    'España',
    'Estados Unidos',
    'Italia',
    'México',
    'Panamá',
    'Puerto Rico',
    'Venezuela',
    'República Dominicana',
    'Ecuador',
    'Chile',
    'Sin Congregación País',
  ];
}
