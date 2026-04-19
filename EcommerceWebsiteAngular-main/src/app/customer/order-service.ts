import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Order, PaymentMethod } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private orderSubject = new BehaviorSubject<Order[]>([]);
  order$ = this.orderSubject.asObservable();

  private orderUrl = 'http://localhost:3000/order';

  placeOrder(paymentMethod: PaymentMethod): Observable<Order[]> {
    return this.http.post<Order[]>(
      `${this.orderUrl}/place_order`,
      { paymentMethod },
      {
        withCredentials: true,
      },
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.orderUrl}/get_my_orders`)
      .pipe(tap((orders) => this.orderSubject.next(orders)));
  }

  getOrderDetail(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.orderUrl}/orders/${orderId}`);
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.delete<Order>(`${this.orderUrl}/delete_order/${orderId}`);
  }

  placeSingleOrder(
    paymentMethod: PaymentMethod,
    productId: number,
    quantity: number,
  ): Observable<Order[]> {
    return this.http.post<Order[]>(`${this.orderUrl}/place_single_order`, {
      paymentMethod,
      productId,
      quantity,
    });
  }
}
