import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from "typeorm";
import { User } from "./User";
import { ShoppingListProduct } from "./ShoppingListProduct";

@Entity('products')
@Unique(["user_id", "name"])
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid", nullable: true })
    user_id!: string | null;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "boolean", default: false })
    is_predefined!: boolean;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id" })
    user!: User | null;

    @OneToMany(() => ShoppingListProduct, shoppingListProduct => shoppingListProduct.product)
    shoppingListProducts!: ShoppingListProduct[];
}
