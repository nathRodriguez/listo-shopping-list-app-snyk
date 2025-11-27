import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth-middleware";
import { UserService } from "../services/user-service";

const router = Router();

router.get("/current", async (req: AuthRequest, res: Response) => {
    try {
        const userService = new UserService();
        const user = await userService.getUserByEmail(req.user.email);
        return res.status(200).json({ user });
    } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;