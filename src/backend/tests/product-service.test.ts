import { ProductService } from '../services/product-service';

const mockProductRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../repositories/product-repository', () => ({
    ProductRepository: jest.fn().mockImplementation(() => mockProductRepository),
}));

describe('ProductService', () => {
    let productService: ProductService;

    beforeEach(() => {
        jest.clearAllMocks();
        productService = new ProductService();
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const mockProduct = {
                id: '123',
                name: 'Test Product',
                user_id: 'user-123',
                is_predefined: false,
            };

            mockProductRepository.create.mockResolvedValue(mockProduct);

            const result = await productService.createProduct({
                name: 'Test Product',
                user_id: 'user-123',
            });

            expect(mockProductRepository.create).toHaveBeenCalledWith({
                name: 'Test Product',
                user_id: 'user-123',
                is_predefined: false,
                user: null,
                shoppingListProducts: []
            });
            expect(result).toEqual({
                id: '123',
                name: 'Test Product',
                user_id: 'user-123',
                is_predefined: false,
            });
        });

        it('should throw error when product name is empty', async () => {
            await expect(productService.createProduct({
                name: '',
                user_id: 'user-123',
            })).rejects.toThrow('Product name is required');

            expect(mockProductRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when product name is only whitespace', async () => {
            await expect(productService.createProduct({
                name: '   ',
                user_id: 'user-123',
            })).rejects.toThrow('Product name is required');

            expect(mockProductRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error when product already exists for user', async () => {
            mockProductRepository.create.mockRejectedValue(new Error('Product already exists'));

            await expect(productService.createProduct({
                name: 'My Custom Product',
                user_id: 'user-123',
            })).rejects.toThrow('Product already exists');
        });
    });
    describe('getUserProducts', () => {
        it('should return formatted products for a user including predefined ones', async () => {
            const mockProducts = [
                {
                    id: '1',
                    name: 'Milk',
                    is_predefined: true,
                    user_id: null
                },
                {
                    id: '2',
                    name: 'Custom Product',
                    is_predefined: false,
                    user_id: 'user123'
                }
            ];

            const expectedResult = [
                {
                    id: '1',
                    name: 'Milk',
                    is_predefined: true,
                    user_id: null
                },
                {
                    id: '2',
                    name: 'Custom Product',
                    is_predefined: false,
                    user_id: 'user123'
                }
            ];

            mockProductRepository.findByUserId.mockResolvedValue(mockProducts);

            const result = await productService.getUserProducts('user123');

            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual(expectedResult);
        });

        it('should return empty array when user has no products', async () => {
            mockProductRepository.findByUserId.mockResolvedValue([]);

            const result = await productService.getUserProducts('user123');

            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual([]);
        });

        it('should handle repository errors', async () => {
            const error = new Error('Database connection failed');
            mockProductRepository.findByUserId.mockRejectedValue(error);

            await expect(productService.getUserProducts('user123')).rejects.toThrow('Database connection failed');
        });
    });

    describe('deleteUserProduct', () => {
        it('should delete a user product', async () => {
            const mockProduct = {
                id: 'product123',
                name: 'Custom Product',
                is_predefined: false,
                user_id: 'user123'
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockProductRepository.delete.mockResolvedValue(undefined);

            await productService.deleteUserProduct('product123', 'user123');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).toHaveBeenCalledWith('product123');
        });

        it('should throw error when product can not be found', async () => {
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(productService.deleteUserProduct('product123', 'user123'))
                .rejects.toThrow('Product not found');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error when trying to delete predefined product', async () => {
            const mockProduct = {
                id: 'product123',
                name: 'Milk',
                is_predefined: true,
                user_id: null
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);

            await expect(productService.deleteUserProduct('product123', 'user123'))
                .rejects.toThrow('Cannot delete predefined products');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error when trying to delete a product of another user', async () => {
            const mockProduct = {
                id: 'product123',
                name: 'Custom Product',
                is_predefined: false,
                user_id: 'otherUser'
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);

            await expect(productService.deleteUserProduct('product123', 'user123'))
                .rejects.toThrow('Product is not owned by the user');

            expect(mockProductRepository.findById).toHaveBeenCalledWith('product123');
            expect(mockProductRepository.delete).not.toHaveBeenCalled();
        });
    });
});
