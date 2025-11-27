import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async create(user: Omit<User, "id">): Promise<User> {
        const existing = await this.repository.findOne({ where: { email: user.email } });
        if (existing) {
            throw new Error("User already exists");
        }
        const newUser = this.repository.create(user);
        return await this.repository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email } });
    }
}