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

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
