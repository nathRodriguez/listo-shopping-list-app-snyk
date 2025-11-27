import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { ShoppingListProduct } from "../models/ShoppingListProduct";

export class ShoppingListProductsRepository {
    private repository: Repository<ShoppingListProduct>;

    constructor() {
        this.repository = AppDataSource.getRepository(ShoppingListProduct);
    }

    async findByListId(listId: string): Promise<ShoppingListProduct[]> {
        return this.repository.find({
            where: { list_id: listId },
            order: { added_at: "DESC" }
        });
    }

    async createOrUpdate(entry: ShoppingListProduct): Promise<ShoppingListProduct> {
        return this.repository.save(entry);
    }

    async delete(listId: string, productId: string): Promise<void> {
        await this.repository.delete({ list_id: listId, product_id: productId });
    }
}
