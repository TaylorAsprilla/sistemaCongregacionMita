# Sistemacmi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class||interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Títulos de las páginas

Las rutas definen `title` con el nombre de cada página. `PageTitleStrategy`
aplica el formato `Página | CMAR LIVE` y antepone `PRUEBAS · ` cuando
`environment.production` es falso. El login distingue `Acceso QR` si recibe
un ticket e `Iniciar sesión` en caso contrario. Los títulos no incluyen
nombres de usuarios, identificadores, tickets ni tokens.
Las migas de navegación conservan sus datos visuales y no modifican el título
de la pestaña. Al añadir una página, definir su `title` en la ruta.

```powershell
npm test -- --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.titles.spec.json --include=src/app/core/services/page-title.strategy.spec.ts
```

### Pruebas enfocadas de informes

Desde este directorio, con Chrome instalado, ejecute:

```powershell
npm test -- --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.informes.spec.json --include='src/app/pages/informes/informe/informe.component.spec.ts'
```

El `tsconfig.informes.spec.json` delimita la compilación de pruebas del flujo de informes. Para cubrir los cambios relacionados, agregue argumentos `--include` con estos archivos:

- `src/app/services/informe/informe.service.spec.ts`
- `src/app/components/contexto-informe/contexto-informe.component.spec.ts`
- `src/app/pages/informes/informe-metas/informe-metas.component.spec.ts`

## Flujo de informes trimestrales

- Seleccione la Congregación antes de diligenciar sus secciones. Al cambiar de informe se cancela la consulta anterior; una respuesta tardía no puede reemplazar la selección actual.
- Los nueve editores muestran una línea compartida con tipo y nombre de Congregación y trimestre del informe activo. El contexto se conserva en la sesión y se recupera desde el informe si falta tras recargar. Sin selección activa, este componente no consulta otro informe.
- Guardar registros y revisar una sección son acciones distintas. Desde el informe principal, **Marcar revisada** registra la revisión explícita; **Sin novedades** solicita confirmación y deja constancia de que no hay novedades, sin borrar registros existentes.
- Antes del cierre manual se actualiza el resumen y se muestran Congregación, período, responsables y secciones con datos, revisadas, sin novedades y pendientes. Las secciones pendientes generan una advertencia, pero no impiden cerrar un informe incompleto. El cierre conserva el registro histórico y deshabilita su edición.
- **Ver historial de cambios** permite consultar actor, fecha, sección y detalle de los cambios autorizados del informe seleccionado.
- Las metas pendientes se consultan por el ámbito del informe actual, no por su creador. Completar una meta de un informe anterior primero crea su continuación en el informe abierto y luego completa esa continuación; no modifica la meta del informe histórico.

## Rol principal del usuario conectado

El menú del encabezado enlaza Perfil y Cambiar contraseña mediante rutas absolutas
bajo `/sistema`, independientemente de la página actual. Mis informes enlaza
`/sistema/mis-informes` y solo se ofrece a obrero de ciudad o de campo, conforme
al guard existente. Configuración no se muestra mientras no exista una pantalla
para esa función. Cerrar sesión conserva el cierre gestionado por UsuarioService.

```powershell
npm test -- --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.header.spec.json --include=src/app/shared/header/header.component.spec.ts
```

El menú de perfil del encabezado y el panel lateral muestran una única insignia debajo del nombre del usuario. Se selecciona el primer permiso presente en este orden: **ADMINISTRADOR > ADMINISTRADOR PAÍS > ADMINISTRADOR MULTIMEDIA > COMITE RECTOR > SUPERVISOR > SUPERVISOR LOCAL > ASISTENTE OOTS > APROBADOR MULTIMEDIA > OBRERO PAÍS > OBRERO CIUDAD > OBRERO CAMPO > AYUDANTE > MULTIMEDIA > USUARIO > PRUEBA INFORMES**.

La selección ignora diferencias de mayúsculas, acentos y espacios externos. Sin un rol reconocido no se muestra la insignia, incluidas las sesiones QR o multimedia que no tengan un usuario con permisos. Esta prioridad es solo visual: no agrega, quita ni cambia permisos de acceso.

```powershell
npm test -- --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.perfil.spec.json --include=src\app\shared\rol-usuario\rol-usuario.component.spec.ts
```

## Excel de solicitudes multimedia

El botón **Exportar** utiliza los permisos del usuario conectado:

- Solo el permiso exacto **ADMINISTRADOR** permite exportar el Excel completo de auditoría y ver su advertencia de datos sensibles. Se descarga una fila por cada solicitud del historial de los usuarios filtrados, incluyendo todas las páginas y estados anteriores.
- Los demás permisos, incluidos **OBRERO PAÍS**, **OBRERO CIUDAD**, **ADMINISTRADOR PAÍS** y **ADMINISTRADOR MULTIMEDIA**, descargan el Excel básico: `Numero_mita`, `Nombre`, `Email`, `Celular`, `Congregacion`, `Campo` y `Estado`, más `Razon_solicitud`, `Otra_razon`, `Usuario_registra`, `Fecha_registro`, `Fecha_aprobacion`, `Duracion_aprobada_dias` y `Aprobado_hasta`. Se descarga una fila por usuario filtrado, con los datos de su última solicitud. No incluye quién aprobó (ni su identificador), detalles adicionales de salud ni historial. El motivo y la otra razón son textos registrados en la solicitud y pueden contener información personal.

Ambas exportaciones respetan los filtros actuales e incluyen todas las páginas. El filtro de estado selecciona usuarios por su última solicitud. Si un usuario tiene varios permisos, basta con que uno sea **ADMINISTRADOR** para habilitar la exportación completa. Este cambio limita el contenido del Excel, no los permisos existentes de consulta de solicitudes en pantalla o mediante la API.

El Excel completo incluye identificadores de usuario y solicitud, contacto y domicilio, ubicación congregacional y obreros responsables, motivos y detalles de transporte, salud, cuidador, estudios y base militar, observaciones, motivo de negación, verificación de correo, aceptación de términos, fechas y usuarios que registraron o aprobaron. Los datos personales y congregacionales corresponden a la información actual del usuario, no a una copia histórica al momento de la solicitud.

Los campos sin información quedan vacíos; los booleanos se muestran como **Sí/No**. Las fechas conservan el formato de la API (las marcas de tiempo ISO incluyen zona horaria). `Fecha_aprobacion` registra el instante de la última aprobación o renovación y `Duracion_aprobada_dias` el intervalo entre ese instante y el vencimiento, con hasta seis decimales; no es el tiempo sugerido. `Aprobado_hasta` (o `Fecha_vencimiento_aprobacion` en auditoría) es el vencimiento del acceso. Los históricos sin fecha y duración verificables quedan vacíos: nunca se calculan desde la última actualización. La última actualización no equivale a un historial de cambios. No se exportan contraseñas. El archivo completo contiene información personal y de salud y debe manejarse exclusivamente por personal autorizado para auditoría interna.

Antes de desplegar el backend debe aplicarse la migración `011-solicitud-multimedia-fecha-aprobacion.sql` de ese proyecto. Agrega dos columnas nulas y no modifica ni infiere datos históricos.

Pruebas enfocadas:

```powershell
npm test -- --watch=false --browsers=ChromeHeadless --ts-config=tsconfig.multimedia.spec.json --include=src\app\components\solicitudes-multimedia\solicitudes-multimedia.component.spec.ts
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
