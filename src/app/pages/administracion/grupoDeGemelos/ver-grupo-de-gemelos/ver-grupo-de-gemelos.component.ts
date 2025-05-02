import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GemelosService } from 'src/app/services/gemelos/gemelos.service';

@Component({
  selector: 'app-ver-grupo-de-gemelos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-grupo-de-gemelos.component.html',
  styleUrl: './ver-grupo-de-gemelos.component.scss',
})
export default class VerGrupoDeGemelosComponent {
  grupos: any[] = [];

  constructor(private gemelosService: GemelosService) {}

  ngOnInit(): void {
    this.gemelosService.getGruposGemelos().subscribe({
      next: (res) => {
        if (res.ok) {
          this.grupos = res.grupos;
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
      },
    });
  }
}
