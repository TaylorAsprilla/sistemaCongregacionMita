import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Rutas } from '../routes/menu-items';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  color = 'blue';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  showRtl = false;

  public innerWidth: any;

  public config: PerfectScrollbarConfigInterface = {};
  constructor(public router: Router) {}

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate([Rutas.INICIO]);
    }
    this.handleLayout();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.handleLayout();
  }

  toggleSidebar() {
    this.showMinisidebar = !this.showMinisidebar;
  }

  handleLayout() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }
}
