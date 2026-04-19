import { Routes } from '@angular/router';
import { authGuard } from '../auth/guard/auth/auth-guard';

export const userRoutes: Routes = [
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./usercart/usercart').then((m) => m.UserCart),
  },

  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./order-history/order-history').then((m) => m.OrderHistory),
  },
  {
    path: 'orders/:orderId',
    canActivate: [authGuard],
    loadComponent: () => import('./order-details/order-details').then((m) => m.OrderDetails),
  },
  {
    path: 'checkout/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./checkout/checkout').then((m) => m.Checkout),
  },
];
