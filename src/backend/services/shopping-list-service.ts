import { ShoppingListRepository } from '../repositories/shopping-list-repository';

export class ShoppingListService {
    private shoppingListRepository: ShoppingListRepository;

    constructor() {
        this.shoppingListRepository = new ShoppingListRepository();
    }

    async getShoppingListsByUserId(userId: string) {
        const shoppingLists = await this.shoppingListRepository.findByUserId(userId);
        return shoppingLists.map(list => ({
            id: list.id,
            title: list.name, // Map name to title for frontend compatibility
            productList: list.shoppingListProducts?.map(slp => slp.product.name) || []
        }));
    }

    async createShoppingList(name: string, userId: string) {
        const shoppingList = await this.shoppingListRepository.create(name, userId);
        return {
            id: shoppingList.id,
            title: shoppingList.name,
            productList: []
        };
    }

    async deleteShoppingList(listId: string, userId: string): Promise<void> {
        const shoppingList = await this.shoppingListRepository.findById(listId);

        if (!shoppingList) {
            throw new Error("Shopping list not found");
        }

        if (shoppingList.user_id !== userId) {
            throw new Error("Shopping list does not belong to the user");
        }

        await this.shoppingListRepository.delete(listId);
    }
}