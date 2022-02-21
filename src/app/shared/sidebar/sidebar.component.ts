import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  // menuItems: any[] = [];
  // showMenu = '';
  // showSubMenu = '';
  // public sidebarnavItems: any[] = [];

  // constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute) {}

  // ngOnInit() {
  //   this.sidebarnavItems = ROUTES.filter((sidebarnavItem: any) => sidebarnavItem);
  // }
  // // End open close

  // // this is for the open close
  // addExpandClass(element: any) {
  //   if (element === this.showMenu) {
  //     this.showMenu = '0';
  //   } else {
  //     this.showMenu = element;
  //   }
  // }
  // addActiveClass(element: any) {
  //   if (element === this.showSubMenu) {
  //     this.showSubMenu = '0';
  //   } else {
  //     this.showSubMenu = element;
  //   }
  // }

  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[] = [];
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(private modalService: NgbModal, private router: Router, private route: ActivatedRoute) {}
  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter((sidebarnavItem) => sidebarnavItem);
  }
}
