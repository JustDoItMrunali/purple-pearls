import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { OrderItem } from '../../models/order-item.model';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { OrderResponse } from '../../models/order.model';

@Component({
  selector: 'app-view-order-details',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './view-order-details.html',
  styleUrl: './view-order-details.css',
})
export class ViewOrderDetails implements OnInit {
  private adminService = inject(AdminService);
  orderDetail$!: Observable<OrderItem[]>;
  private route = inject(ActivatedRoute);
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.orderDetail$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('orderId'));

        // Log 1: Monitor the ID coming from the URL
        console.log('--- Order Detail Request ---');
        console.log('Extracted Order ID from URL:', id);

        return this.adminService.getOrderDetails(id).pipe(
          catchError((err) => {
            // Log 2: Monitor backend errors
            console.error('API Error details:', err);
            this.errorMessage = err.error?.message || 'Failed to load order items.';
            return EMPTY;
          }),
        );
      }),
      tap((items) => {
        // Log 3: Monitor the final data array
        console.log('--- Order Detail Response ---');
        console.log('Items received from Backend:', items);

        if (items && items.length === 0) {
          console.warn('Warning: The order exists, but the items array is empty.');
        }
      }),
    );
  }
}
