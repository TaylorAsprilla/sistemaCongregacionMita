import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-bredcrumbs',
  templateUrl: './bredcrumbs.component.html',
  styleUrls: ['./bredcrumbs.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class BredcrumbsComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Input() layout: string = '';
  public pageInfo: any;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        this.pageInfo = event;
      });
  }
}
