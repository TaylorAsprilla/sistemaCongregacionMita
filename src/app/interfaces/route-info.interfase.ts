import { ROLES } from '../enum/roles.enum';

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
