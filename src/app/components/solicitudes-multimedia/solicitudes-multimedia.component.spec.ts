import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Swal from 'sweetalert2';
import { ESTADO_SOLICITUD_MULTIMEDIA_ENUM as Estado } from 'src/app/core/enums/solicitudMultimendia.enum';
import { SolicitudInterface } from 'src/app/core/interfaces/solicitud-multimedia.interface';
import { UsuarioSolicitudMultimediaModel } from 'src/app/core/models/usuario-solicitud.model';
import { ExportarExcelService } from 'src/app/services/exportar-excel/exportar-excel.service';
import { SolicitudesMultimediaComponent } from './solicitudes-multimedia.component';

describe('SolicitudesMultimediaComponent', () => {
  let component: SolicitudesMultimediaComponent;
  let exportador: jasmine.SpyObj<ExportarExcelService>;

  const responsable = {
    id: 50,
    primerNombre: 'Ana',
    segundoNombre: '',
    primerApellido: 'Perez',
    segundoApellido: '',
  };

  function solicitud(cambios: Partial<SolicitudInterface> = {}): SolicitudInterface {
    return {
      id: 101,
      emailVerificado: true,
      otraRazon: 'Otra justificacion',
      tiempoDistancia: '2 horas',
      personaEncamada: true,
      personaEncargada: 'Cuidador',
      celularPersonaEncargada: '+17870000001',
      enfermedadCronica: true,
      enfermedadQuePadece: 'Condicion de prueba',
      paisDondeEstudia: 'Pais de estudio',
      ciudadDondeEstudia: 'Ciudad de estudio',
      duracionDelPeriodoDeEstudio: '2027-06-30T00:00:00.000Z',
      baseMilitar: 'Base de prueba',
      horaTemploMasCercano: '10:00',
      tiempoSugerido: 30,
      tiempoAprobacion: '2027-01-01T12:34:56.000Z',
      congregacionCercana: 'Templo cercano',
      observaciones: 'Primera linea\nSegunda linea',
      motivoDeNegacion: 'Motivo de prueba',
      razonSolicitud: { solicitud: 'Salud' },
      parentesco: { nombre: 'Hijo' },
      tipoEstudio: { estudio: 'Universitario' },
      opcionTransporte: { tipoTransporte: 'Publico' },
      usuarioQueRegistra: responsable,
      usuarioQueAprobo: { ...responsable, id: 51 },
      estado: Estado.APROBADA,
      createdAt: '2026-10-01T12:34:56.789Z',
      updatedAt: '2026-10-02T13:34:56.789Z',
      terminos: true,
      ...cambios,
    };
  }

  function usuario(id: number, solicitudes: SolicitudInterface[]): UsuarioSolicitudMultimediaModel {
    return new UsuarioSolicitudMultimediaModel(
      id, 'Luis', '', 'Lopez', '', '+17870000000', 'auditoria@example.test', '1990-01-01',
      'Calle de prueba', 'Ciudad', 'Departamento', 'Pais domicilio', 'login-prueba',
      solicitudes,
      { id: 1, miembro: 'Miembro', estado: true },
      {
        id: 1,
        pais: { id: 1, pais: 'Puerto Rico', obreroEncargado: responsable },
        congregacion: { id: 2, congregacion: 'Congregacion', obreroEncargado: responsable },
        campo: { id: 3, campo: 'Campo', obreroEncargado: responsable },
      },
    );
  }

  beforeEach(async () => {
    exportador = jasmine.createSpyObj<ExportarExcelService>('ExportarExcelService', ['exportToExcel']);
    await TestBed.configureTestingModule({
      imports: [SolicitudesMultimediaComponent],
      providers: [
        provideRouter([]),
        { provide: ExportarExcelService, useValue: exportador },
      ],
    })
      .overrideComponent(SolicitudesMultimediaComponent, { set: { template: '', imports: [] } })
      .compileComponents();

    const fixture = TestBed.createComponent(SolicitudesMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exporta todos los datos de cada solicitud, con fechas completas y responsables identificables', () => {
    component.filteredSolicitudes = [usuario(10, [solicitud()])];
    component.nombreArchivo = 'Auditoria';

    component.exportarDatosFiltrados();

    expect(exportador.exportToExcel).toHaveBeenCalledOnceWith([{
      Numero_mita: 10,
      Nombre: 'Luis Lopez',
      Email: 'auditoria@example.test',
      Celular: '+17870000000',
      Fecha_nacimiento: '1990-01-01',
      Tipo_miembro: 'Miembro',
      Direccion: 'Calle de prueba',
      Ciudad_direccion: 'Ciudad',
      Departamento_direccion: 'Departamento',
      Pais_direccion: 'Pais domicilio',
      Login: 'login-prueba',
      Pais: 'Puerto Rico',
      Congregacion: 'Congregacion',
      Campo: 'Campo',
      ID_obrero_pais: 50,
      Obrero_pais: 'Ana Perez',
      ID_obrero_congregacion: 50,
      Obrero_congregacion: 'Ana Perez',
      ID_obrero_campo: 50,
      Obrero_campo: 'Ana Perez',
      ID_solicitud: 101,
      Estado: Estado.APROBADA,
      Fecha_creacion: '2026-10-01T12:34:56.789Z',
      Fecha_ultima_actualizacion: '2026-10-02T13:34:56.789Z',
      Email_verificado: 'Sí',
      Terminos_aceptados: 'Sí',
      Razon_solicitud: 'Salud',
      Otra_razon: 'Otra justificacion',
      Tiempo_distancia: '2 horas',
      Congregacion_cercana: 'Templo cercano',
      Hora_templo_mas_cercano: '10:00',
      Tipo_transporte: 'Publico',
      Persona_encamada: 'Sí',
      Persona_encargada: 'Cuidador',
      Celular_persona_encargada: '+17870000001',
      Parentesco: 'Hijo',
      Enfermedad_cronica: 'Sí',
      Enfermedad_que_padece: 'Condicion de prueba',
      Tipo_estudio: 'Universitario',
      Pais_donde_estudia: 'Pais de estudio',
      Ciudad_donde_estudia: 'Ciudad de estudio',
      Fin_periodo_estudio: '2027-06-30T00:00:00.000Z',
      Base_militar: 'Base de prueba',
      Tiempo_sugerido_dias: 30,
      Fecha_vencimiento_aprobacion: '2027-01-01T12:34:56.000Z',
      Observaciones: 'Primera linea\nSegunda linea',
      Motivo_negacion: 'Motivo de prueba',
      ID_usuario_registra: 50,
      Usuario_registra: 'Ana Perez',
      ID_usuario_aprobo: 51,
      Usuario_aprobo: 'Ana Perez',
    }], 'Auditoria');
  });

  it('respeta los filtros por usuario e incluye historial de otros estados y todas las paginas', () => {
    const seleccionado = usuario(10, [
      solicitud({ id: 101, estado: Estado.DENEGADA }),
      solicitud({ id: 102, estado: Estado.APROBADA }),
    ]);
    const otroSeleccionado = usuario(20, [solicitud({ id: 103 })]);
    const excluido = usuario(30, [solicitud({ id: 104, estado: Estado.PENDIENTE })]);
    component.solicitudes = [seleccionado, otroSeleccionado, excluido];
    component.filterForm.patchValue({ estados: Estado.APROBADA });
    component.pageSize = 1;
    component.pagina = 2;
    const antes = JSON.stringify(component.solicitudes);

    component.exportarDatosFiltrados();

    const filas = exportador.exportToExcel.calls.mostRecent().args[0];
    expect(filas.map((fila) => fila.ID_solicitud)).toEqual([101, 102, 103]);
    expect(filas.map((fila) => fila.Estado)).toEqual([Estado.DENEGADA, Estado.APROBADA, Estado.APROBADA]);
    expect(JSON.stringify(component.solicitudes)).toBe(antes);
    expect(exportador.exportToExcel.calls.mostRecent().args[1]).toBe('Solicitudes_multimedia');
  });

  it('distingue datos ausentes de No y conserva ceros y fechas Date', () => {
    component.filteredSolicitudes = [usuario(10, [solicitud({
      emailVerificado: false,
      personaEncamada: null,
      enfermedadCronica: false,
      terminos: null,
      tiempoSugerido: 0,
      parentesco: null,
      tipoEstudio: null,
      opcionTransporte: null,
      usuarioQueAprobo: null,
      tiempoAprobacion: null,
      duracionDelPeriodoDeEstudio: null,
      createdAt: new Date('2026-10-01T12:34:56.789Z'),
      updatedAt: undefined,
    })])];

    component.exportarDatosFiltrados();

    const fila = exportador.exportToExcel.calls.mostRecent().args[0][0];
    expect(fila).toEqual(jasmine.objectContaining({
      Email_verificado: 'No',
      Persona_encamada: '',
      Enfermedad_cronica: 'No',
      Terminos_aceptados: '',
      Tiempo_sugerido_dias: 0,
      Parentesco: '',
      Tipo_estudio: '',
      Tipo_transporte: '',
      ID_usuario_aprobo: '',
      Usuario_aprobo: '',
      Fecha_vencimiento_aprobacion: '',
      Fin_periodo_estudio: '',
      Fecha_creacion: '2026-10-01T12:34:56.789Z',
      Fecha_ultima_actualizacion: '',
    }));
    expect(Object.values(fila).every((valor) => typeof valor === 'string' || typeof valor === 'number')).toBeTrue();
  });

  it('muestra una notificacion en lugar de descargar un Excel vacio', () => {
    const aviso = spyOn(Swal, 'fire');
    component.filteredSolicitudes = [usuario(10, [])];

    component.exportarDatosFiltrados();

    expect(exportador.exportToExcel).not.toHaveBeenCalled();
    expect(aviso).toHaveBeenCalledWith(
      'Sin solicitudes', 'No hay solicitudes para exportar con los filtros actuales.', 'info',
    );
  });
});
