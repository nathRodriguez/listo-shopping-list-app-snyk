import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user-repository";
import { User } from "../models/User";

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, email, password: hashedPassword };
        return this.userRepository.create(user);
    }

    async login({ email, password }: { email: string; password: string }): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { user, token };
    }

    async refresh(token: string): Promise<{ token: string }> {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!, { ignoreExpiration: true }) as any;
            const user = await this.userRepository.findByEmail(payload.email);
            if (!user) {
                throw new Error("User not found");
            }
            const newToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            return { token: newToken };
        } catch {
            throw new Error("Invalid token");
        }
    }
}