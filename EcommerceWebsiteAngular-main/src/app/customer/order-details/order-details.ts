import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { OrderService } from '../order-service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, AsyncPipe, CurrencyPipe, DatePipe, TitleCasePipe,RouterLinkActive],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  orderDetail$!: Observable<Order | null>;
  errorMessage: string | null = null;
  orderId: number | null = null;

  ngOnInit(): void {
    this.orderDetail$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.errorMessage = null;
        this.orderId = Number(params.get('orderId'));

        return this.orderService.getOrderDetail(this.orderId).pipe(
          catchError((err) => {
            this.errorMessage =
              err.status === 404
                ? 'Order not found.'
                : 'Failed to load order details. Please try again.';
            return of(null);
          }),
        );
      }),
      tap((order) => {
        if (order && order.items.length === 0 && !this.errorMessage) {
          this.errorMessage = 'This order has no items.';
        }
      }),
    );
  }
}
