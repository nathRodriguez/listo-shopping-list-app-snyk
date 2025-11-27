import { AuthService } from '../services/auth-service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
};

jest.mock('../repositories/user-repository', () => ({
    UserRepository: jest.fn().mockImplementation(() => mockUserRepository),
}));

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService();
        process.env.JWT_SECRET = 'testsecret';
        process.env.JWT_REFRESH_SECRET = 'refreshsecret';
    });

    describe('Register', () => {
        it('should hash the password and create a user successfully', async () => {
            const userData = { name: 'John', email: 'john@example.com', password: 'password' };
            const hashedPassword = 'hashedpassword';
            const mockUser = { id: '1', name: 'John', email: 'john@example.com', password: hashedPassword };

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(mockUser);

            const result = await authService.register(userData);

            expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: 'John',
                email: 'john@example.com',
                password: hashedPassword,
            });
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if user creation fails', async () => {
            const userData = { name: 'John', email: 'john@example.com', password: 'password' };
            const error = new Error('Database error');

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockRejectedValue(error);

            await expect(authService.register(userData)).rejects.toThrow('Database error');
        });
    });

    describe('Login', () => {
        it('should return user and token on successful login', async () => {
            const loginData = { email: 'john@example.com', password: 'password' };
            const mockUser = { id: '1', name: 'John', email: 'john@example.com', password: 'hashedpassword' };
            const token = 'token';

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue(token);

            const result = await authService.login(loginData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith({ id: '1', email: 'john@example.com', name: 'John' }, 'testsecret', { expiresIn: '1h' });
            expect(result).toEqual({ user: mockUser, token });
        });

        it('should throw error for invalid credentials - user not found', async () => {
            const loginData = { email: 'john@example.com', password: 'password' };

            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        });

        it('should throw error for invalid credentials - wrong password', async () => {
            const loginData = { email: 'john@example.com', password: 'wrongpassword' };
            const mockUser = { id: '1', name: 'John', email: 'john@example.com', password: 'hashedpassword' };

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('Refresh', () => {
        it('should return new token on valid token', async () => {
            const token = 'validtoken';
            const decoded = { id: '1', email: 'john@example.com' };
            const mockUser = { id: '1', name: 'John', email: 'john@example.com' };
            const newToken = 'newtoken';

            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue(newToken);

            const result = await authService.refresh(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, 'testsecret', { ignoreExpiration: true });
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(jwt.sign).toHaveBeenCalledWith({ id: '1', email: 'john@example.com', name: 'John' }, 'testsecret', { expiresIn: '1h' });
            expect(result).toEqual({ token: newToken });
        });

        it('should throw error for invalid token', async () => {
            const token = 'invalidtoken';

            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid'); });

            await expect(authService.refresh(token)).rejects.toThrow('Invalid token');
        });
    });
});