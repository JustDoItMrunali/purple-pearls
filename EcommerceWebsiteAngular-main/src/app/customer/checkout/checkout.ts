import { Component, inject, OnInit } from '@angular/core';
import { PaymentMethod } from '../../models/order.model';
import { OrderService } from '../order-service';
import { ActivatedRoute } from '@angular/router';
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
  paymentMethods = Object.values(PaymentMethod);
  selectedPayment: any = PaymentMethod.CASH_ON_DELIVERY;
  productId!: number;
  isCartOrder: boolean = false;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isCartOrder = this.route.snapshot.url.some((segment) => segment.path === 'cart');
    if (!this.isCartOrder) {
      this.productId = Number(id);
    }
  }
  onPaymentSelect(value: any) {
    this.selectedPayment = value;
  }

  quantity: number = 1;
  increment() {
    this.quantity++;
  }

  decrement() {
    this.quantity--;
  }

  private orderService = inject(OrderService);
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
    const confirmOrder = confirm('Are you sure you want to place this order?');
    if (confirmOrder) {
      this.orderService.placeOrder(this.selectedPayment).subscribe({
        next: (res) => {
          alert('order placed successfully');
        },
        error: (err) => {
          console.log(err.error.message);
        },
      });
    }
  }
}
