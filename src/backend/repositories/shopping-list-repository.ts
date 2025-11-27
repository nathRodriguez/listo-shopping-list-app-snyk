import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { ShoppingList } from "../models/ShoppingList";

export class ShoppingListRepository {
    private repository: Repository<ShoppingList>;

    constructor() {
        this.repository = AppDataSource.getRepository(ShoppingList);
    }

    async findByUserId(userId: string): Promise<ShoppingList[]> {
        return await this.repository.find({
            where: { user_id: userId },
            relations: ['shoppingListProducts', 'shoppingListProducts.product'],
            order: { added_at: 'DESC' }
        });
    }

    async create(name: string, userId: string): Promise<ShoppingList> {
        // Check if shopping list with same name already exists for this user
        const existing = await this.repository.findOne({
            where: { user_id: userId, name: name }
        });
        if (existing) {
            throw new Error("Shopping list with this name already exists");
        }

        const shoppingList = this.repository.create({
            name,
            user_id: userId,
            is_completed: false
        });
        return await this.repository.save(shoppingList);
    }

    async findById(id: string): Promise<ShoppingList | null> {
        return await this.repository.findOne({
            where: { id }
        });
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}