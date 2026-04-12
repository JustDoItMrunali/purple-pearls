import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { OrderResponse } from '../../models/order.model';

@Component({
  selector: 'app-view-orders',
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './view-orders.html',
  styleUrl: './view-orders.css',
})
export class ViewOrders implements OnInit {
  private adminService = inject(AdminService);
  order$!: Observable<OrderResponse>;
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.order$ = this.adminService.order$;
    this.adminService.getOrders().subscribe({
      next: () => (this.loading = false),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message;
      },
    });
  }
}
