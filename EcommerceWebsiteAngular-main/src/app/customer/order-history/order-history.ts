  import { Component, inject, OnInit } from '@angular/core';
  import { OrderService } from '../order-service';
  import { tap } from 'rxjs';
  import { AsyncPipe, CommonModule } from '@angular/common';

  @Component({
    selector: 'app-order-history',
    imports: [CommonModule, AsyncPipe],
    templateUrl: './order-history.html',
    styleUrl: './order-history.css',
  })
  export class OrderHistory implements OnInit {
    private orderService = inject(OrderService);
    order$ = this.orderService.order$;
    ngOnInit(): void {
      this.order$ = this.orderService.order$;
      this.orderService.getMyOrders().subscribe();
    }
  }
