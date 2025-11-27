import { ProductRepository } from '../repositories/product-repository';

export interface CreateProductDto {
    name: string;
    user_id: string;
}

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async createProduct(data: CreateProductDto) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('Product name is required');
        }

        const product = await this.productRepository.create({
            name: data.name.trim(),
            user_id: data.user_id,
            is_predefined: false,
            user: null,
            shoppingListProducts: []
        });

        return {
            id: product.id,
            name: product.name,
            user_id: product.user_id,
            is_predefined: product.is_predefined
        };
    }

    async getUserProducts(userId: string): Promise<any[]> {
        const products = await this.productRepository.findByUserId(userId);
        return products.map(product => ({
            id: product.id,
            name: product.name,
            is_predefined: product.is_predefined,
            user_id: product.user_id
        }));
    }

    async deleteUserProduct(productId: string, userId: string): Promise<void> {
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.is_predefined) {
            throw new Error("Cannot delete predefined products");
        }

        if (product.user_id !== userId) {
            throw new Error("Product is not owned by the user");
        }

        await this.productRepository.delete(productId);
    }
}
