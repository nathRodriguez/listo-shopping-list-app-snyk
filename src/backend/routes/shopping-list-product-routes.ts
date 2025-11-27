import { Router, Response } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { AuthRequest } from "../middleware/auth-middleware";
import { ShoppingListProductsService } from "../services/shopping-list-product-service";

const router = Router();

// GET list products
router.get("/:listId", async (req: AuthRequest, res: Response) => {
    try {
        const { listId } = req.params;
        const service = new ShoppingListProductsService();
        const items = await service.getProductsForList(listId);

        return res.status(200).json({ items });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST add product
router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const service = new ShoppingListProductsService();
        const item = await service.addProduct(req.body);

        return res.status(201).json({ item });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// PUT update product
router.put("/", async (req: AuthRequest, res: Response) => {
    try {
        const service = new ShoppingListProductsService();
        const item = await service.updateProduct(req.body);

        return res.status(200).json({ item });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE remove product
router.delete("/:listId/:productId", async (req: AuthRequest, res: Response) => {
    try {
        const { listId, productId } = req.params;
        const service = new ShoppingListProductsService();

        await service.deleteProduct(listId, productId);

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
