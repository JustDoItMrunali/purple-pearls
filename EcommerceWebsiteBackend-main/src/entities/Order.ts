import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  CASH_ON_DELIVERY = "cash_on_delivery",
  BANK_TRANSFER = "bank_transfer",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  order_id!: number;

  @CreateDateColumn()
  placedAt!: Date;

  // Total is stored at order time — not recalculated later from items
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: "simple-enum", enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @Column({
    type: "simple-enum",
    enum: OrderStatus,
    default: OrderStatus.CONFIRMED,
  })
  status!: OrderStatus;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];
}
