import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QrCodeService } from 'src/app/services/qrCode/qr-code.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { delay, Subscription } from 'rxjs';
import { CongregacionModel } from 'src/app/core/models/congregacion.model';
import { CargandoInformacionComponent } from 'src/app/components/cargando-informacion/cargando-informacion.component';

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [ReactiveFormsModule, CargandoInformacionComponent],
  templateUrl: './qr-code-generator.component.html',
  styleUrl: './qr-code-generator.component.scss',
})
export default class QrCodeGeneratorComponent {
  qrForm: FormGroup;
  qrCode: string;
  qrUrl: string;
  qrImage: string;

  cargando: boolean = true;
  congregaciones: CongregacionModel[] = [];

  // Subscription
  congregacionSubscription: Subscription;

  constructor(
    private qrCodeService: QrCodeService,
    private formBuilder: FormBuilder,
    private congregacionService: CongregacionService
  ) {}

  ngOnInit() {
    this.qrForm = this.formBuilder.group({
      idCongregacion: [null, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.cargarCongregaciones();
  }

  ngOnDestroy(): void {
    this.congregacionSubscription?.unsubscribe();
  }

  cargarCongregaciones() {
    this.cargando = true;
    this.congregacionSubscription = this.congregacionService
      .getCongregaciones()
      .pipe(delay(100))
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
        this.cargando = false;
      });
  }

  generateQRCode() {
    if (this.qrForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const { idCongregacion, descripcion } = this.qrForm.value;

    Swal.fire({
      title: 'Generando QR...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.qrCodeService.getQRCode(Number(idCongregacion), descripcion).subscribe({
      next: (response) => {
        Swal.close();
        if (response.ok) {
          this.qrCode = response.qrCode;
          this.qrUrl = response.qrUrl;
          this.qrImage = `data:image/png;base64,${response.qrImage}`;

          Swal.fire({
            icon: 'success',
            title: 'Código QR generado',
            text: 'El código QR ha sido creado exitosamente.',
            confirmButtonColor: '#28a745',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo generar el código QR.',
            confirmButtonColor: '#dc3545',
          });
        }
      },
      error: (error) => {
        Swal.close();
        console.error('Error generando el QR:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'Ocurrió un error al generar el código QR. Intenta nuevamente.',
          confirmButtonColor: '#dc3545',
        });
      },
    });
  }

  async copyQRCode() {
    const base64Data = this.qrImage.includes('base64,') ? this.qrImage.split('base64,')[1] : this.qrImage;

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

      Swal.fire('Copiado', 'Código QR copiado al portapapeles.', 'success');
    } catch (error) {
      console.error('Error al copiar el QR:', error);
      Swal.fire('Error', 'No se pudo copiar el código QR.', 'error');
    }
  }

  downloadQRCode() {
    // Remover prefijo si existe
    const base64Data = this.qrImage.includes('base64,') ? this.qrImage.split('base64,')[1] : this.qrImage;

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const url = URL.createObjectURL(blob);

      // Crear nombre con fecha actual
      const now = new Date();
      const formattedDate = now
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14); // YYYYMMDDHHMMSS
      const filename = `QR-Multimedia-${formattedDate}.png`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el código QR:', error);
      Swal.fire('Error', 'No se pudo descargar el código QR. Intenta de nuevo.', 'error');
    }
  }
}
