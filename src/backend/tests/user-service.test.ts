import { UserService } from '../services/user-service';

const mockUserRepository = {
    findByEmail: jest.fn(),
};

jest.mock('../repositories/user-repository', () => ({
    UserRepository: jest.fn().mockImplementation(() => mockUserRepository),
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService();
    });

    describe('getUserByEmail', () => {
        it('should return user data when user exists', async () => {
            const mockUser = { id: '1', name: 'John', email: 'john@example.com', password: 'hashed' };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await userService.getUserByEmail('john@example.com');

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(result).toEqual({ id: '1', name: 'John', email: 'john@example.com' });
        });

        it('should throw error when user not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(userService.getUserByEmail('nonexistent@example.com')).rejects.toThrow('User not found');
        });
    });
});