import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
//   {
//     path: 'admin-dashboard',
//     loadComponent: () => import('./').then((m) => m.AdminDashboard),
//   },
  {
    path: 'addproduct',
    loadComponent: () => import('./manage-products/manage-products').then((m) => m.ManageProducts), // Assuming class name is ManageProducts
  },
  {
    path: 'manage-users',
    loadComponent: () => import('./manage-users/manage-users').then((m) => m.ManageUsers),
  },
  {
    path: 'user-order',
    loadComponent: () => import('./view-orders/view-orders').then((m) => m.ViewOrders),
  },
  {
    path: 'user-order/:orderId',
    loadComponent: () =>
      import('./view-order-details/view-order-details').then((m) => m.ViewOrderDetails),
  },
  {
    path: 'customer-detail/:userId',
    loadComponent: () =>
      import('./customer-details/customer-details').then((m) => m.CustomerDetails),
  },
  {
    path: '',
    redirectTo: 'admin-dashboard',
    pathMatch: 'full',
  },
];
