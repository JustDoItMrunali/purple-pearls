import { Component, inject } from '@angular/core';
import { AdminService } from '../admin-service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../../products/product-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-landing',
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './admin-landing.html',
  styleUrl: './admin-landing.css',
})
export class AdminLanding {
  public adminService = inject(AdminService);
  public productService = inject(ProductService);
  constructor() {
    this.adminService.getCustomers().subscribe();
    this.productService.getProducts().subscribe();
    this.adminService.getOrders().subscribe();
  }

  stats$ = combineLatest({
    customers: this.adminService.customer$,
    products: this.productService.product$,
    orders: this.adminService.order$,
  }).pipe(
    map(({ customers, products, orders }) => {
      return {
        totalCustomers: customers?.length || 0,
        activeCustomers: customers?.filter((u) => !u.isLocked).length || 0,
        totalOrders: orders?.meta?.total || 0,
        totalProducts: products?.meta?.total || 0,
      };
    }),
  );
}
