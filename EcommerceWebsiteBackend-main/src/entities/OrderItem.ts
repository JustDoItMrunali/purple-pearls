import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_item")
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id!: number;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  priceAtPurchase!: number;

  @Column()
  productName!: string;

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product | null;
}
