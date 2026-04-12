import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity("product_type")
export class ProductType {
    @PrimaryGeneratedColumn()
    type_id!: number;

    @Column({ unique: true })
    name!: string;

    @OneToMany(() => Category, (category) => category.productType)
    categories!: Category[];
}