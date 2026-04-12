import { OrderItem } from './order-item.model';
import {User} from './user.model';
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  BANK_TRANSFER = 'bank_transfer',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
export interface Order {
  order_id: number;
  placedAt: Date;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  user: User;
  items: OrderItem[];
}

export interface OrderResponse{
  data:Order[],
  meta:{
    total:number,
    page:number,
    limit:number,
    totalPages:number
  }
}