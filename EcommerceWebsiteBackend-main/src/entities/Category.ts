import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { ProductType } from "./ProductType";
import { SubCategory } from "./SubCategory";

@Entity("category")
export class Category {
    @PrimaryGeneratedColumn()
    category_id!: number;

    @Column({ unique: true })
    name!: string;

    @ManyToOne(() => ProductType, (productType) => productType.categories, { nullable: false, onDelete: "RESTRICT" })
    @JoinColumn({ name: "type_id" })
    productType!: ProductType;

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
    subCategories!: SubCategory[];

    
}