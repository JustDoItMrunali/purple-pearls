import { Routes } from '@angular/router';
import { Dashboard } from './admin/dashboard/dashboard';
import { ProductDetail } from './products/product-detail/product-detail';
import { ProductList } from './products/product-list/product-list';
import { UserCart } from './customer/usercart/usercart';
import { Checkout } from './customer/checkout/checkout';
import { OrderHistory } from './customer/order-history/order-history';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './auth/guard/admin/admin-guard';
import { authGuard } from './auth/guard/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'admin',
    component:AdminDashboard,
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'auth',
    canActivate:[authGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./admin/dashboard/dashboard').then((m) => Dashboard),
  },
  { path: 'products/:product_id', component: ProductDetail },
  {
    path: 'products',
    component: ProductList,
  },
  {
    path: 'cart',
    component: UserCart,
  },
  {
    path: 'checkout/:id',
    component: Checkout,
  },
  {
    path: 'order',
    component: OrderHistory,
  },
  {
    path:'',
    component:ProductList
  }
];
