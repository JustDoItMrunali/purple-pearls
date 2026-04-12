import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import Product from '../models/product.model';
import { Order, OrderResponse } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  private adminUrl = 'http://localhost:3000/adminProduct';
  private adminUrlCustomer = 'http://localhost:3000/auth';
  private adminCustomerUrl = 'http://localhost:3000/adminCustomer';
  // private orderUrl = 'http://localhost:3000/order';
  private productSubject = new BehaviorSubject<Product | null>(null);
  adminProduct$ = this.productSubject.asObservable();

  private customerSubject = new BehaviorSubject<User[]>([]);
  customer$ = this.customerSubject.asObservable();

  private orderSubject = new BehaviorSubject<OrderResponse>({
    data: [],
    meta: { total: 0, totalPages: 0, page: 1, limit: 20 },
  });
  order$ = this.orderSubject.asObservable();
  // --- Product Management ---

  getAllProducts(): Observable<Product> {
    return this.http
      .get<Product>(`${this.adminUrl}/get-products`)
      .pipe(tap((product) => this.productSubject.next(product)));
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.adminUrl}/upload-product`, productData);
  }

  updateProduct(productID: number, productData: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.adminUrl}/update-products/${productID}`, {
      productData,
    });
  }

  deleteProduct(productId: number): Observable<Product> {
    return this.http.delete<Product>(`${this.adminUrl}/products/${productId}`).pipe(
      tap((product) => {
        this.productSubject.next(product);
      }),
    );
  }

  // --- Customer Management ---

  getCustomers(): Observable<any> {
    return this.http.get<any>(`${this.adminCustomerUrl}/customers`).pipe(
      tap((users) => {
        console.log('Data from API:', users);
        this.customerSubject.next(users.data);
      }),
    );
  }

  getCustomerDetails(userId: number): Observable<User> {
    return this.http.get<User>(`${this.adminCustomerUrl}/customers/${userId}`);
  }

  lockStatus(userId: number) {
    return this.http.patch(`${this.adminUrlCustomer}/users/${userId}/lock`, {});
  }

  unlockStatus(userId: number) {
    return this.http.patch(`${this.adminUrlCustomer}/users/${userId}/unlock`, {});
  }

  // --- Order Management ---

  getOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.adminOrderUrl}/orders`).pipe(
      tap((response) => {
        console.log('Response with Meta:', response);
        this.orderSubject.next(response);
      }),
    );
  }

  private adminOrderUrl = 'http://localhost:3000/adminCustomer';

  getOrderDetails(orderId: number): Observable<OrderItem[]> {
    // This results in: http://localhost:3000/adminCustomer/orders/21
    return this.http.get<OrderItem[]>(`${this.adminOrderUrl}/orders/${orderId}`);
  }
}
