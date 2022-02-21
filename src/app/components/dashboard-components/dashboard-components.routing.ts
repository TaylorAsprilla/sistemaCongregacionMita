import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: DashboardComponent,
        data: {
          title: 'Modern Dashboard',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Modern Dashboard' }],
        },
      },
      {
        path: 'dashboard2',
        component: DashboardComponent,
        data: {
          title: 'Classic Dashboard',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Classic Dashboard' }],
        },
      },
      {
        path: 'dashboard3',
        component: DashboardComponent,
        data: {
          title: 'Analytical Dashboard',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Analytical Dashboard' }],
        },
      },
    ],
  },
];
