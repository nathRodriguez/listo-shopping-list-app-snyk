import { Repository} from "typeorm";
import { AppDataSource } from "../config/database";
import { Product } from "../models/Product";

export class ProductRepository {
    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    async create(product: Omit<Product, "id">): Promise<Product> {
        const allProducts = await this.findByUserId(product.user_id!);

        const existingProduct = allProducts.find(
            p => p.name.toLowerCase() === product.name.toLowerCase()
        );

        if (existingProduct) {
            throw new Error("Product already exists");
        }

        const newProduct = this.repository.create(product);
        return await this.repository.save(newProduct);
    }

    async findByUserId(userId: string): Promise<Product[]> {
        return this.repository.find({
            where: [
                { user_id: userId },
                { is_predefined: true }
            ]
        });
    }

    async findById(productId: string): Promise<Product | null> {
        return this.repository.findOne({
            where: { id: productId }
        });
    }

    async delete(productId: string): Promise<void> {
        await this.repository.delete(productId);
    }
}
