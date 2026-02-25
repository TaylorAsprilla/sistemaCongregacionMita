import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { GlobalLoadingComponent } from './shared/global-loading/global-loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, GlobalLoadingComponent],
})
export class AppComponent {
  title = 'sistemacmi';
}
