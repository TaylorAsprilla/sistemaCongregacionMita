import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class AyudaComponent {}
