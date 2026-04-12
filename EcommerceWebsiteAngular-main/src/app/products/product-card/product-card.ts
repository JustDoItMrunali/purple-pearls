import { Component, inject, Input, OnInit } from '@angular/core';
import Product from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { WishlistResponse } from '../../models/wishlist.model';
import { ProductService } from '../product-service';
import { Cart } from '../../models/cart-tem.model';
import { CartService } from '../../customer/cart-service';
import { PaymentMethod } from '../../models/order.model';
import { OrderService } from '../../customer/order-service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  isInWishlist = false;
  isLoading = false;
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  addCart(product_id: number, quantity: number) {
    this.cartService.addCart(product_id, quantity).subscribe({
      next: (res) => {
        alert('Item added to cart');
      },
      error: (err) => {
        alert(err);
      },
    });
  }
}
