import { ShoppingListProductsRepository } from "../repositories/shopping-list-product-repository";
import { ShoppingListProduct } from "../models/ShoppingListProduct";

export class ShoppingListProductsService {
    private repo: ShoppingListProductsRepository;

    constructor() {
        this.repo = new ShoppingListProductsRepository();
    }

    async getProductsForList(listId: string) {
        const entries = await this.repo.findByListId(listId);
        return entries.map(item => ({
            list_id: item.list_id,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
            is_checked: item.is_checked,
            added_at: item.added_at
        }));
    }

    async addProduct(data: {
        list_id: string;
        product_id: string;
        price?: number;
        quantity?: number;
        unit?: string;
    }) {
        const entry = new ShoppingListProduct();
        entry.list_id = data.list_id;
        entry.product_id = data.product_id;
        entry.price = data.price ?? 0;
        entry.quantity = data.quantity ?? 1;
        entry.unit = data.unit ?? "";
        entry.is_checked = false;

        return await this.repo.createOrUpdate(entry);
    }

    async updateProduct(data: {
        list_id: string;
        product_id: string;
        price?: number;
        quantity?: number;
        unit?: string;
        is_checked?: boolean;
    }) {
        return await this.repo.createOrUpdate(data as ShoppingListProduct);
    }

    async deleteProduct(listId: string, productId: string) {
        await this.repo.delete(listId, productId);
    }
}
