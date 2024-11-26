import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';


@Component({
    selector: 'app-bredcrumbs',
    templateUrl: './bredcrumbs.component.html',
    styleUrls: ['./bredcrumbs.component.css'],
    standalone: true,
    imports: [
    RouterLink
],
})
export class BredcrumbsComponent {
  @Input() layout: string = '';
  public pageInfo: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) {
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
        this.titleService.setTitle(event['title']);
        this.pageInfo = event;
      });
  }
}
