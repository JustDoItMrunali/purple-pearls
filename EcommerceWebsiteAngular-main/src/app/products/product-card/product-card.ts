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
import { AdminService } from '../../admin/admin-service';
import { AuthService } from '../../auth/auth-service';

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
  private cartService = inject(CartService);

  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }
  
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          console.log('deleted product');
        },
      });
    }
  }
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
