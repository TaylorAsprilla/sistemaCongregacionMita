/**
 * Configuración de mensajes de loading para endpoints de la API
 *
 * Este archivo centraliza todos los mensajes que se mostrarán durante las llamadas HTTP.
 * Los mensajes se mapean por:
 * 1. Patrón de URL (regex o string)
 * 2. Método HTTP (GET, POST, PUT, DELETE, PATCH)
 * 3. Prioridad: más específico gana
 *
 * @example
 * // Para agregar un nuevo endpoint:
 * {
 *   pattern: /\/api\/miendpoint/,
 *   method: 'GET',
 *   message: 'Consultando mi endpoint...'
 * }
 */

export interface LoadingMessageConfig {
  pattern: RegExp | string; // Patrón para hacer match con la URL
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ALL'; // Método HTTP (opcional)
  message: string; // Mensaje a mostrar
  priority?: number; // Prioridad (mayor = más específico, default: 1)
}

/**
 * Configuración de mensajes de loading por endpoint.
 *
 * ORDEN DE EVALUACIÓN:
 * 1. Se evalúan de mayor a menor prioridad
 * 2. Si no hay prioridad explícita, se usa el orden de la lista
 * 3. El primer match gana
 *
 * RECOMENDACIONES:
 * - Patrones más específicos primero (ej: /usuarios/query antes que /usuarios)
 * - Usar regex solo cuando sea necesario
 * - Mensajes cortos y descriptivos (máx 40 caracteres)
 * - Usar verbos en gerundio: "Cargando...", "Guardando...", "Actualizando..."
 */
export const LOADING_MESSAGES: LoadingMessageConfig[] = [
  // ========================================
  // AUTENTICACIÓN Y SESIÓN
  // ========================================
  {
    pattern: /\/auth\/login/,
    method: 'POST',
    message: 'Iniciando sesión...',
    priority: 10,
  },
  {
    pattern: /\/auth\/logout/,
    method: 'POST',
    message: 'Cerrando sesión...',
    priority: 10,
  },
  {
    pattern: /\/auth\/refresh/,
    method: 'POST',
    message: 'Renovando sesión...',
    priority: 10,
  },
  {
    pattern: /\/auth\/recuperar/,
    method: 'POST',
    message: 'Enviando correo de recuperación...',
    priority: 10,
  },
  {
    pattern: /\/auth\/cambiar-password/,
    method: 'POST',
    message: 'Cambiando contraseña...',
    priority: 10,
  },

  // ========================================
  // USUARIOS
  // ========================================
  {
    pattern: /\/usuarios$/,
    method: 'GET',
    message: 'Consultando usuarios...',
    priority: 5,
  },
  {
    pattern: /\/usuarios$/,
    method: 'POST',
    message: 'Creando usuario...',
    priority: 5,
  },
  {
    pattern: /\/usuarios\/\d+/,
    method: 'PUT',
    message: 'Actualizando usuario...',
    priority: 6,
  },
  {
    pattern: /\/usuarios\/\d+/,
    method: 'DELETE',
    message: 'Eliminando usuario...',
    priority: 6,
  },
  {
    pattern: /\/usuarios\/\d+/,
    method: 'GET',
    message: 'Consultando usuario...',
    priority: 6,
  },
  {
    pattern: /\/usuarios\/buscar/,
    method: 'GET',
    message: 'Buscando usuarios...',
    priority: 7,
  },

  // ========================================
  // CONGREGACIONES
  // ========================================
  {
    pattern: /\/congregaciones/,
    method: 'GET',
    message: 'Consultando congregaciones...',
    priority: 5,
  },
  {
    pattern: /\/congregaciones/,
    method: 'POST',
    message: 'Creando congregación...',
    priority: 5,
  },
  {
    pattern: /\/congregaciones\/\d+/,
    method: 'PUT',
    message: 'Actualizando congregación...',
    priority: 6,
  },

  // ========================================
  // OBREROS
  // ========================================
  {
    pattern: /\/obreros/,
    method: 'GET',
    message: 'Consultando obreros...',
    priority: 5,
  },
  {
    pattern: /\/obreros/,
    method: 'POST',
    message: 'Guardando obrero...',
    priority: 5,
  },
  {
    pattern: /\/obreros\/\d+/,
    method: 'PUT',
    message: 'Actualizando obrero...',
    priority: 6,
  },

  // ========================================
  // INFORMES
  // ========================================
  {
    pattern: /\/informes/,
    method: 'GET',
    message: 'Consultando informes...',
    priority: 5,
  },
  {
    pattern: /\/informes/,
    method: 'POST',
    message: 'Guardando informe...',
    priority: 5,
  },
  {
    pattern: /\/informes.*excel/i,
    method: 'GET',
    message: 'Generando reporte Excel...',
    priority: 7,
  },
  {
    pattern: /\/informes.*pdf/i,
    method: 'GET',
    message: 'Generando reporte PDF...',
    priority: 7,
  },

  // ========================================
  // MULTIMEDIA
  // ========================================
  {
    pattern: /\/multimedia/,
    method: 'GET',
    message: 'Consultando multimedia...',
    priority: 5,
  },
  {
    pattern: /\/multimedia/,
    method: 'POST',
    message: 'Subiendo archivo...',
    priority: 5,
  },
  {
    pattern: /\/multimedia\/\d+/,
    method: 'DELETE',
    message: 'Eliminando archivo...',
    priority: 6,
  },

  // ========================================
  // PAÍSES, DIVISAS, CATALOGOS
  // ========================================
  {
    pattern: /\/paises/,
    method: 'GET',
    message: 'Consultando países...',
    priority: 5,
  },
  {
    pattern: /\/divisas/,
    method: 'GET',
    message: 'Consultando divisas...',
    priority: 5,
  },
  {
    pattern: /\/campos/,
    method: 'GET',
    message: 'Consultando campos...',
    priority: 5,
  },
  {
    pattern: /\/genero/,
    method: 'GET',
    message: 'Consultando géneros...',
    priority: 5,
  },
  {
    pattern: /\/estado-civil/,
    method: 'GET',
    message: 'Consultando estados civiles...',
    priority: 5,
  },
  {
    pattern: /\/tipo-miembro/,
    method: 'GET',
    message: 'Consultando tipos de miembro...',
    priority: 5,
  },
  {
    pattern: /\/ministerio/,
    method: 'GET',
    message: 'Consultando ministerios...',
    priority: 5,
  },
  {
    pattern: /\/voluntariado/,
    method: 'GET',
    message: 'Consultando voluntariados...',
    priority: 5,
  },

  // ========================================
  // DASHBOARD Y ESTADÍSTICAS
  // ========================================
  {
    pattern: /\/dashboard/,
    method: 'GET',
    message: 'Cargando dashboard...',
    priority: 5,
  },
  {
    pattern: /\/estadisticas/,
    method: 'GET',
    message: 'Consultando estadísticas...',
    priority: 5,
  },
  {
    pattern: /\/censo/,
    method: 'GET',
    message: 'Consultando censo...',
    priority: 5,
  },

  // ========================================
  // DIEZMOS Y TRANSACCIONES
  // ========================================
  {
    pattern: /\/diezmos/,
    method: 'GET',
    message: 'Consultando diezmos...',
    priority: 5,
  },
  {
    pattern: /\/diezmos/,
    method: 'POST',
    message: 'Guardando diezmo...',
    priority: 5,
  },

  // ========================================
  // AYUDANTES
  // ========================================
  {
    pattern: /\/ayudantes/,
    method: 'GET',
    message: 'Consultando ayudantes...',
    priority: 5,
  },
  {
    pattern: /\/ayudantes/,
    method: 'POST',
    message: 'Guardando ayudante...',
    priority: 5,
  },

  // ========================================
  // ACCESOS QR
  // ========================================
  {
    pattern: /\/accesos.*qr/i,
    method: 'GET',
    message: 'Consultando accesos QR...',
    priority: 5,
  },
  {
    pattern: /\/accesos.*qr/i,
    method: 'POST',
    message: 'Generando código QR...',
    priority: 5,
  },

  // ========================================
  // CORREOS
  // ========================================
  {
    pattern: /\/enviar-correo/,
    method: 'POST',
    message: 'Enviando correo...',
    priority: 5,
  },

  // ========================================
  // PERFIL
  // ========================================
  {
    pattern: /\/perfil/,
    method: 'GET',
    message: 'Consultando perfil...',
    priority: 5,
  },
  {
    pattern: /\/perfil/,
    method: 'PUT',
    message: 'Actualizando perfil...',
    priority: 5,
  },

  // ========================================
  // FALLBACK GENÉRICO (MENOR PRIORIDAD)
  // ========================================
  {
    pattern: /./,
    method: 'GET',
    message: 'Consultando datos...',
    priority: 1,
  },
  {
    pattern: /./,
    method: 'POST',
    message: 'Loading...',
    priority: 1,
  },
  {
    pattern: /./,
    method: 'PUT',
    message: 'Actualizando información...',
    priority: 1,
  },
  {
    pattern: /./,
    method: 'PATCH',
    message: 'Actualizando información...',
    priority: 1,
  },
  {
    pattern: /./,
    method: 'DELETE',
    message: 'Eliminando información...',
    priority: 1,
  },
];

/**
 * Obtiene el mensaje de loading apropiado para una URL y método HTTP
 *
 * @param url - URL del endpoint
 * @param method - Método HTTP (GET, POST, etc.)
 * @returns Mensaje de loading correspondiente
 *
 * @example
 * getLoadingMessage('/api/usuarios', 'GET') // => 'Consultando usuarios...'
 * getLoadingMessage('/api/usuarios/123', 'PUT') // => 'Actualizando usuario...'
 */
export function getLoadingMessage(url: string, method: string = 'GET'): string {
  // Ordenar por prioridad (mayor primero)
  const sortedConfigs = [...LOADING_MESSAGES].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  // Buscar el primer match
  for (const config of sortedConfigs) {
    // Verificar método
    if (config.method && config.method !== 'ALL' && config.method !== method.toUpperCase()) {
      continue;
    }

    // Verificar patrón
    const matches = typeof config.pattern === 'string' ? url.includes(config.pattern) : config.pattern.test(url);

    if (matches) {
      return config.message;
    }
  }

  // Fallback final
  return 'Procesando...';
}
