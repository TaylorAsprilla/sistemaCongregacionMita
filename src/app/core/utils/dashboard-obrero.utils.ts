import {
  UsuarioCompleto,
  EstadisticasDashboard,
  DistribucionItem,
  SerieTemporal,
} from '../interfaces/dashboard-obrero.interface';

/**
 * Calcula todas las estadísticas del dashboard a partir de la lista de usuarios
 * @param usuarios Lista de usuarios completos
 * @returns Objeto con todas las estadísticas calculadas
 */
export function calcularEstadisticasDashboard(usuarios: UsuarioCompleto[]): EstadisticasDashboard {
  const totalUsuarios = usuarios.length;
  const totalJovenes = usuarios.filter((u) => u.esJoven).length;

  return {
    totalUsuarios,
    nuevosUltimos7Dias: calcularNuevosUsuarios(usuarios, 7),
    nuevosUltimos30Dias: calcularNuevosUsuarios(usuarios, 30),
    activos: usuarios.filter((u) => u.estado === true).length,
    inactivos: usuarios.filter((u) => u.estado === false).length,
    promedioEdad: calcularPromedioEdad(usuarios),
    totalJovenes,
    porcentajeJovenes: calcularPorcentaje(totalJovenes, totalUsuarios),
    usuariosConVoluntariado: usuarios.filter((u) => u.usuarioVoluntariado && u.usuarioVoluntariado.length > 0).length,
    porcentajeVoluntariado: calcularPorcentaje(
      usuarios.filter((u) => u.usuarioVoluntariado && u.usuarioVoluntariado.length > 0).length,
      totalUsuarios,
    ),
    usuariosConMinisterio: usuarios.filter(
      (u) => u.usuarioMinisterio && u.usuarioMinisterio.some((m) => m.ejerceMinisterio),
    ).length,
    porcentajeMinisterio: calcularPorcentaje(
      usuarios.filter((u) => u.usuarioMinisterio && u.usuarioMinisterio.some((m) => m.ejerceMinisterio)).length,
      totalUsuarios,
    ),
    distribucionGenero: calcularDistribucionGenero(usuarios),
    distribucionEstadoCivil: calcularDistribucionEstadoCivil(usuarios),
    distribucionNacionalidad: calcularDistribucionNacionalidad(usuarios),
    distribucionTipoMiembro: calcularDistribucionTipoMiembro(usuarios),
    distribucionMinisterio: calcularDistribucionMinisterio(usuarios),
    serieTemporal: calcularSerieTemporal(usuarios),
  };
}

/**
 * Calcula cuántos usuarios fueron creados en los últimos N días
 * @param usuarios Lista de usuarios
 * @param dias Número de días a contar hacia atrás
 * @returns Cantidad de usuarios nuevos
 */
export function calcularNuevosUsuarios(usuarios: UsuarioCompleto[], dias: number): number {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);

  return usuarios.filter((usuario) => {
    if (!usuario.createdAt) return false;
    const fechaCreacion = new Date(usuario.createdAt);
    return fechaCreacion >= fechaLimite;
  }).length;
}

/**
 * Calcula el porcentaje con 2 decimales
 * @param cantidad Cantidad parcial
 * @param total Cantidad total
 * @returns Porcentaje redondeado a 2 decimales
 */
export function calcularPorcentaje(cantidad: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((cantidad / total) * 10000) / 100;
}

/**
 * Calcula la distribución por género
 * @param usuarios Lista de usuarios
 * @returns Array con la distribución
 */
export function calcularDistribucionGenero(usuarios: UsuarioCompleto[]): DistribucionItem[] {
  const conteo = new Map<string, number>();

  usuarios.forEach((usuario) => {
    const genero = usuario.genero?.genero || 'Sin especificar';
    conteo.set(genero, (conteo.get(genero) || 0) + 1);
  });

  return Array.from(conteo.entries())
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: calcularPorcentaje(cantidad, usuarios.length),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Calcula la distribución por estado civil
 * @param usuarios Lista de usuarios
 * @returns Array con la distribución
 */
export function calcularDistribucionEstadoCivil(usuarios: UsuarioCompleto[]): DistribucionItem[] {
  const conteo = new Map<string, number>();

  usuarios.forEach((usuario) => {
    const estadoCivil = usuario.estadoCivil?.estadoCivil || 'Sin especificar';
    conteo.set(estadoCivil, (conteo.get(estadoCivil) || 0) + 1);
  });

  return Array.from(conteo.entries())
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: calcularPorcentaje(cantidad, usuarios.length),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Calcula la distribución por nacionalidad (top 10)
 * @param usuarios Lista de usuarios
 * @returns Array con la distribución (top 10)
 */
export function calcularDistribucionNacionalidad(usuarios: UsuarioCompleto[]): DistribucionItem[] {
  const conteo = new Map<string, number>();

  usuarios.forEach((usuario) => {
    const nacionalidad = usuario.nacionalidad?.nacionalidad || 'Sin especificar';
    conteo.set(nacionalidad, (conteo.get(nacionalidad) || 0) + 1);
  });

  return Array.from(conteo.entries())
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: calcularPorcentaje(cantidad, usuarios.length),
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10); // Top 10
}

/**
 * Calcula la distribución por tipo de miembro
 * @param usuarios Lista de usuarios
 * @returns Array con la distribución
 */
export function calcularDistribucionTipoMiembro(usuarios: UsuarioCompleto[]): DistribucionItem[] {
  const conteo = new Map<string, number>();

  usuarios.forEach((usuario) => {
    const tipoMiembro = usuario.tipoMiembro?.tipo || 'Sin especificar';
    conteo.set(tipoMiembro, (conteo.get(tipoMiembro) || 0) + 1);
  });

  return Array.from(conteo.entries())
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: calcularPorcentaje(cantidad, usuarios.length),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Calcula la serie temporal de usuarios creados (últimos 12 meses)
 * @param usuarios Lista de usuarios
 * @returns Array con la cantidad de usuarios por mes
 */
export function calcularSerieTemporal(usuarios: UsuarioCompleto[]): SerieTemporal[] {
  const resultado: SerieTemporal[] = [];
  const ahora = new Date();

  // Generar últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const mesNombre = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });

    const cantidad = usuarios.filter((usuario) => {
      if (!usuario.createdAt) return false;
      const fechaCreacion = new Date(usuario.createdAt);
      return fechaCreacion.getMonth() === fecha.getMonth() && fechaCreacion.getFullYear() === fecha.getFullYear();
    }).length;

    resultado.push({
      fecha: mesNombre,
      cantidad,
    });
  }

  return resultado;
}

/**
 * Obtiene el nombre completo del usuario
 * @param usuario Usuario
 * @returns Nombre completo
 */
export function obtenerNombreCompleto(usuario: UsuarioCompleto): string {
  const partes = [usuario.primerNombre, usuario.segundoNombre, usuario.primerApellido, usuario.segundoApellido].filter(
    Boolean,
  );
  return partes.join(' ') || 'Sin nombre';
}

/**
 * Calcula la edad a partir de la fecha de nacimiento
 * @param fechaNacimiento Fecha de nacimiento (string)
 * @returns Edad en años o null si no hay fecha
 */
export function calcularEdad(fechaNacimiento?: string): number | null {
  if (!fechaNacimiento) return null;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

/**
 * Calcula el promedio de edad de los usuarios
 * @param usuarios Lista de usuarios
 * @returns Promedio de edad redondeado a 2 decimales
 */
export function calcularPromedioEdad(usuarios: UsuarioCompleto[]): number {
  const usuariosConEdad = usuarios.filter((u) => u.fechaNacimiento);
  if (usuariosConEdad.length === 0) return 0;

  const sumaEdades = usuariosConEdad.reduce((suma, usuario) => {
    const edad = calcularEdad(usuario.fechaNacimiento);
    return suma + (edad || 0);
  }, 0);

  return Math.round((sumaEdades / usuariosConEdad.length) * 100) / 100;
}

/**
 * Calcula la distribución por ministerio
 * @param usuarios Lista de usuarios
 * @returns Array con la distribución por ministerio
 */
export function calcularDistribucionMinisterio(usuarios: UsuarioCompleto[]): DistribucionItem[] {
  const conteo = new Map<string, number>();

  usuarios.forEach((usuario) => {
    if (usuario.usuarioMinisterio && usuario.usuarioMinisterio.length > 0) {
      usuario.usuarioMinisterio.forEach((ministerio) => {
        const nombre = ministerio.ministerio || 'Sin especificar';
        conteo.set(nombre, (conteo.get(nombre) || 0) + 1);
      });
    }
  });

  const usuariosSinMinisterio = usuarios.filter((u) => !u.usuarioMinisterio || u.usuarioMinisterio.length === 0).length;

  if (usuariosSinMinisterio > 0) {
    conteo.set('Sin ministerio', usuariosSinMinisterio);
  }

  return Array.from(conteo.entries())
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: calcularPorcentaje(cantidad, usuarios.length),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Exporta datos a CSV
 * @param datos Array de objetos a exportar
 * @param nombreArchivo Nombre del archivo sin extensión
 */
export function exportarCSV(datos: any[], nombreArchivo: string): void {
  if (datos.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Obtener las claves del primer objeto
  const headers = Object.keys(datos[0]);

  // Crear las filas
  const filas = datos.map((obj) =>
    headers
      .map((header) => {
        const valor = obj[header];
        // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
        if (valor === null || valor === undefined) return '';
        const valorStr = String(valor).replace(/"/g, '""');
        return valorStr.includes(',') || valorStr.includes('\n') ? `"${valorStr}"` : valorStr;
      })
      .join(','),
  );

  // Combinar headers y filas
  const csv = [headers.join(','), ...filas].join('\n');

  // Crear blob y descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${nombreArchivo}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
