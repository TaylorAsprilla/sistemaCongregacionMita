import { ROLES } from 'src/app/routes/menu-items';

// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  icon?: string;
  class?: string;
  extralink?: boolean;
  role?: ROLES[];
  submenu?: RouteInfo[];
}
