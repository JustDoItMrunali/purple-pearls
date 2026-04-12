import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("wishlist")
export class Wishlist {
  @PrimaryGeneratedColumn()
  wishlist_id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.wishlists)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Product, (product) => product.wishlists)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @CreateDateColumn()
  addedAt!: Date;
}
