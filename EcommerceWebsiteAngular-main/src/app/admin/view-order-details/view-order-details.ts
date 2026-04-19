import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { catchError, EMPTY, Observable, switchMap, tap, of } from 'rxjs';
import { OrderItem } from '../../models/order-item.model';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-order-details',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './view-order-details.html',
  styleUrl: './view-order-details.css',
})
export class ViewOrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);

  orderDetail$!: Observable<OrderItem[] | null>;
  errorMessage: string | null = null;
  orderId: number | null = null;

  ngOnInit(): void {
    this.orderDetail$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.errorMessage = null;
        this.orderId = Number(params.get('orderId'));

        return this.adminService.getOrderDetails(this.orderId).pipe(
          catchError((err) => {
            this.errorMessage = 'Failed to load order items';
            return of([]);
          }),
        );
      }),
      tap((items) => {
        if (items && items.length === 0 && !this.errorMessage) {
          this.errorMessage = 'This order has no items';
        }
      }),
    );
  }
}
