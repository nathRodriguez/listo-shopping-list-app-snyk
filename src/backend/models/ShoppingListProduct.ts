import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ShoppingList } from "./ShoppingList";
import { Product } from "./Product";

@Entity('shopping_list_products')
export class ShoppingListProduct {
    @PrimaryColumn({ type: "uuid" })
    list_id!: string;

    @PrimaryColumn({ type: "uuid" })
    product_id!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    price!: number | null;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    quantity!: number | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    unit!: string | null;

    @Column({ type: "boolean", default: false })
    is_checked!: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    added_at!: Date;

    @ManyToOne(() => ShoppingList, shoppingList => shoppingList.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "list_id" })
    shoppingList!: ShoppingList;

    @ManyToOne(() => Product, product => product.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "product_id" })
    product!: Product;
}