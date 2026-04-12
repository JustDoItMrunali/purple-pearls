import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart-tem.model';
import { ProductService } from '../../products/product-service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ProductCard } from '../../products/product-card/product-card';
import { ReviewResponse } from '../../models/review.model';
import { CartService } from '../cart-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-usercart',
  imports: [CommonModule, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './usercart.html',
  styleUrl: './usercart.css',
})
export class UserCart implements OnInit {
  private cartService = inject(CartService);
  cart$: Observable<Cart | null> = this.cartService.cart$;
  review$!: Observable<ReviewResponse>;

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.cartService.getCart().subscribe();
  }


  removeItem(cartItemId: number) {
    this.cartService.removeCartItem(cartItemId).subscribe();
  }

 
}
