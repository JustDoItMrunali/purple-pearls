import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { Product } from "./Product";

@Entity("sub_category")
export class SubCategory {
    @PrimaryGeneratedColumn()
    sub_category_id!: number;

    @Column({ unique: true })
    name!: string;

    @ManyToOne(() => Category, (category) => category.subCategories, { nullable: false, onDelete: "RESTRICT" })
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @OneToMany(() => Product, (product) => product.subCategory)
    products!: Product[];
}