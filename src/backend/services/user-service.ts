import { UserRepository } from '../repositories/user-repository';

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return { id: user.id, name: user.name, email: user.email };
    }
}