import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../models/cart-tem.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  //CartServices
  private cartUrl = 'http://localhost:3000/cart';
  addCart(productId: number, quantity: number): Observable<Cart[]> {
    return this.http
      .post<Cart[]>(`${this.cartUrl}/addTo-cart/items`, { productId, quantity })
      .pipe(tap(() => this.getCart().subscribe()));
  }

  private cartSubject = new BehaviorSubject<Cart | null>(null); //initial value is null
  cart$ = this.cartSubject.asObservable();
  getCart(): Observable<Cart> {
    return this.http
      .get<Cart>(`${this.cartUrl}/view-cart`)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<Cart[]> {
    return this.http.patch<Cart[]>(`${this.cartUrl}/update-cart/${cartItemId}`, { quantity });
  }

  removeCartItem(cartItemId: number): Observable<Cart[]> {
    return this.http
      .delete<Cart[]>(`${this.cartUrl}/removeItem-cart/${cartItemId}`)
      .pipe(tap(() => this.getCart().subscribe())); //updates the ui
  }

  clearCart(): Observable<Cart[]> {
    return this.http
      .delete<Cart[]>(`${this.cartUrl}/clear-cart`)
      .pipe(tap((product) => this.getCart().subscribe()));
  }
}
