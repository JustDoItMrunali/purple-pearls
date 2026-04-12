import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity("cart_item")
export class CartItem {
  @PrimaryGeneratedColumn()
  cart_item_id!: number;

  @Column({ default: 1 })
  quantity!: number;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cart_id" })
  cart!: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
