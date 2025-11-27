import { Router, Response } from "express";
import { AuthRequest } from "../middleware/auth-middleware";
import { ProductService } from "../services/product-service";

const router = Router();

router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Product name is required" });
        }

        const productService = new ProductService();
        const product = await productService.createProduct({ name, user_id: req.user.id });

        return res.status(201).json({ product });
    } catch (error) {
        if (error instanceof Error && error.message === 'Product already exists') {
            return res.status(409).json({ error: "Product already exists" });
        }
        if (error instanceof Error && error.message === 'Product name is required') {
            return res.status(400).json({ error: "Product name is required" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const productService = new ProductService();
        const products = await productService.getUserProducts(req.user.id);
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const productService = new ProductService();
        await productService.deleteUserProduct(productId, userId);

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Product not found") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Cannot delete predefined products" ||
                error.message === "Product is not owned by the user") {
                return res.status(403).json({ error: error.message });
            }
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
