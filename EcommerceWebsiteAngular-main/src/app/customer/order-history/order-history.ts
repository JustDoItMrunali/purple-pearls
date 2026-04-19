import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../order-service';
import { tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, AsyncPipe,RouterLink],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  private orderService = inject(OrderService);
  order$ = this.orderService.order$;
  private router = inject(Router);
  ngOnInit(): void {
    this.order$ = this.orderService.order$;
    this.orderService.getMyOrders().subscribe();
  }

  viewDetails(orderId: number): void {
    this.router.navigate(['/user/orders', orderId]);
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => this.orderService.getMyOrders().subscribe(), // refresh list
      error: (err) => console.error('Cancel failed', err),
    });
  }
}
