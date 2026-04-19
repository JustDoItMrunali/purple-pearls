import { Routes } from '@angular/router';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Dashboard } from './shared/dashboard_shared/dashboard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboard,
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'products',
    loadChildren: () => import('./products/product.route').then((m) => m.productRoutes),
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.route').then((m) => m.userRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
