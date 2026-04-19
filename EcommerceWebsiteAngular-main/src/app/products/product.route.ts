import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list').then((m) => m.ProductList),
 },
  {
    path: ':product_id',
    loadComponent: () =>
      import('./product-detail/product-detail').then(
        (m) => m.ProductDetail,
      ),
  
  },
];
