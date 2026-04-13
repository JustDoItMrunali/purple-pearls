import { Component, inject, OnInit } from '@angular/core';
import { PaymentMethod } from '../../models/order.model';
import { OrderService } from '../order-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  paymentMethods = Object.values(PaymentMethod);
  selectedPayment: any = PaymentMethod.CASH_ON_DELIVERY;
  productId!: number;
  isCartOrder: boolean = false;
  quantity: number = 1;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // this.isCartOrder = this.route.snapshot.url.some((segment) => segment.path === 'cart');
    // if (!this.isCartOrder) {
    //   this.productId = Number(id);
    // }
    this.route.queryParams.subscribe((params) => {
      this.isCartOrder = params['mode'] === 'cart';

      if (!this.isCartOrder) {
        this.productId = Number(id);
      }
    });
  }
  onPaymentSelect(value: any) {
    this.selectedPayment = value;
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    this.quantity--;
  }

  //Place single order
  placeSingleOrder() {
    const confirmOrder = confirm('Are you sure you want to place this order?');
    if (confirmOrder) {
      this.orderService
        .placeSingleOrder(this.selectedPayment, this.productId, this.quantity)
        .subscribe({
          next: (res) => {
            alert('order placed successfully');
          },
          error: (err) => {
            alert(err);
          },
        });
    }
  }

  placeOrder() {
    if (!this.selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    const confirmOrder = confirm('Are you sure you want to place this order from your cart?');
    if (confirmOrder) {
      // Pass the selectedPayment to your service
      this.orderService.placeOrder(this.selectedPayment).subscribe({
        next: (res) => {
          alert('Order placed successfully!');
          this.router.navigate(['/orders']); // Navigate to orders page after success
        },
        error: (err) => {
          // Check if error comes from your backend validation (e.g., "Cart is empty")
          console.error(err);
          alert(err.error?.error || 'Failed to place order');
        },
      });
    }
  }
}
