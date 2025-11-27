import { Router, Response } from "express";
import { AuthRequest } from "../middleware/auth-middleware";
import { ShoppingListService } from "../services/shopping-list-service";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const shoppingListService = new ShoppingListService();
        const shoppingLists = await shoppingListService.getShoppingListsByUserId(req.user.id);
        return res.status(200).json({ shoppingLists });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "Name is required and must be a non-empty string" });
        }

        const shoppingListService = new ShoppingListService();
        const shoppingList = await shoppingListService.createShoppingList(name.trim(), req.user.id);
        return res.status(201).json({ shoppingList });
    } catch (error: any) {
        // Handle uniqueness validation error
        if (error instanceof Error && error.message === "Shopping list with this name already exists") {
            return res.status(409).json({ error: "A shopping list with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Invalid shopping list ID" });
        }

        const shoppingListService = new ShoppingListService();
        await shoppingListService.deleteShoppingList(id, req.user.id);
        return res.status(200).json({ message: "Shopping list deleted successfully" });
    } catch (error: any) {
        if (error instanceof Error) {
            if (error.message === "Shopping list not found") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Shopping list does not belong to the user") {
                return res.status(403).json({ error: error.message });
            }
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;