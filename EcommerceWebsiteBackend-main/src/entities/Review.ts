import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("reviews")
export class Review{
    @PrimaryGeneratedColumn()
    review_id!:number;

    @Column({type:"int"})
    rating!:number;

    @Column({type:"text"})
    comment!:string;

    @CreateDateColumn()
    createdAt!:Date;

    @ManyToOne(()=>User,{nullable:false, onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user!:User;

    @ManyToOne(()=>Product,{nullable:false, onDelete:"CASCADE"})
    @JoinColumn({name:"product_id"})
    product!:Product;
}