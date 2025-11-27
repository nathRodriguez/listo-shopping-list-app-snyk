import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth-service";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const authService = new AuthService();
        const user = await authService.register({ name, email, password });
        return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        if (error instanceof Error && error.message === "User already exists") {
            return res.status(409).json({ error: "User already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const authService = new AuthService();
        const { user, token } = await authService.login({ email, password });
        return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        if (error instanceof Error && error.message === "Invalid credentials") {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/refresh", async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "Token required" });
    }
    try {
        const authService = new AuthService();
        const { token: newToken } = await authService.refresh(token);
        return res.status(200).json({ token: newToken });
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
});



export default router;