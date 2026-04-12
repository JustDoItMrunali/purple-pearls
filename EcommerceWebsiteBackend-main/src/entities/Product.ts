import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { SubCategory } from "./SubCategory";
import { CartItem } from "./CartItem";
import { OrderItem } from "./OrderItem";
import { Wishlist } from "./Wishlist";

@Entity("product")
export class Product {
  @PrimaryGeneratedColumn()
  product_id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 0 })
  stock!: number;

  // Stores relative path e.g. "ProductImages/keyboard.jpg"
  // null means no image — frontend shows default placeholder
  @Column({ type: "varchar", nullable: true })
  imagePath!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists!: Wishlist[];

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "sub_category_id" })
  subCategory!: SubCategory;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];
}
