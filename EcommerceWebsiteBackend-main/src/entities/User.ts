import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Wishlist } from "./Wishlist";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column()
  name!: string;

  @Column({ unique: true, length: 254 })
  email!: string;

  @Column({ select: false })
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "simple-enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ default: false })
  isLocked!: boolean;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists!: Wishlist[];

  @Column({ nullable: true })
  address!: string;

  @Column({ type: "bigint", nullable: true })
  phone!: number;
}
