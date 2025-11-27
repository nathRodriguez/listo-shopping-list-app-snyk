import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Unique } from "typeorm";
import { User } from "./User";
import { ShoppingListProduct } from "./ShoppingListProduct";

@Entity('shopping_lists')
@Unique(["user_id", "name"])
export class ShoppingList {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "boolean", default: false })
    is_completed!: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    added_at!: Date;

    @Column({ type: "uuid" })
    user_id!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @OneToMany(() => ShoppingListProduct, shoppingListProduct => shoppingListProduct.shoppingList)
    shoppingListProducts!: ShoppingListProduct[];
}