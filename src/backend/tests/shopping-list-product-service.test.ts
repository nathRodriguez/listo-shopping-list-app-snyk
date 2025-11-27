import { ShoppingListProductsService } from '../services/shopping-list-product-service';

const mockRepo = {
    findByListId: jest.fn(),
    createOrUpdate: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../repositories/shopping-list-product-repository', () => ({
    ShoppingListProductsRepository: jest.fn().mockImplementation(() => mockRepo),
}));

describe('ShoppingListProductsService', () => {
    let service: ShoppingListProductsService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new ShoppingListProductsService();
    });

    describe('getProductsForList', () => {
        it('should return formatted products for a list', async () => {
            const mockEntries = [
                {
                    list_id: '10',
                    product_id: 'A',
                    price: 1000,
                    quantity: 2,
                    unit: 'kg',
                    is_checked: true,
                    added_at: '2024-01-01'
                }
            ];

            mockRepo.findByListId.mockResolvedValue(mockEntries);

            const result = await service.getProductsForList('10');

            expect(mockRepo.findByListId).toHaveBeenCalledWith('10');
            expect(result).toEqual(mockEntries);
        });

        it('should return empty array when list has no products', async () => {
            mockRepo.findByListId.mockResolvedValue([]);

            const result = await service.getProductsForList('10');

            expect(mockRepo.findByListId).toHaveBeenCalledWith('10');
            expect(result).toEqual([]);
        });

        it('should throw if repository fails', async () => {
            mockRepo.findByListId.mockRejectedValue(new Error('DB error'));

            await expect(service.getProductsForList('10')).rejects.toThrow('DB error');
        });
    });

    describe('addProduct', () => {
        it('should create a new product entry with defaults', async () => {
            const input = {
                list_id: '5',
                product_id: 'X'
            };

            const created = {
                list_id: '5',
                product_id: 'X',
                price: 0,
                quantity: 1,
                unit: "",
                is_checked: false
            };

            mockRepo.createOrUpdate.mockResolvedValue(created);

            const result = await service.addProduct(input);

            expect(mockRepo.createOrUpdate).toHaveBeenCalled();
            expect(result).toEqual(created);
        });

        it('should pass the correct values when provided', async () => {
            const input = {
                list_id: '5',
                product_id: 'Z',
                price: 1200,
                quantity: 3,
                unit: 'L'
            };

            const expected = {
                ...input,
                is_checked: false
            };

            mockRepo.createOrUpdate.mockResolvedValue(expected);

            const result = await service.addProduct(input);

            expect(mockRepo.createOrUpdate).toHaveBeenCalledWith(expect.objectContaining(expected));
            expect(result).toEqual(expected);
        });

        it('should throw if repository fails', async () => {
            mockRepo.createOrUpdate.mockRejectedValue(new Error('Insert failed'));

            await expect(service.addProduct({
                list_id: '1',
                product_id: 'A'
            })).rejects.toThrow('Insert failed');
        });
    });

    describe('updateProduct', () => {
        it('should update an existing entry', async () => {
            const data = {
                list_id: '5',
                product_id: '1',
                price: 1500,
                quantity: 2,
                unit: 'kg',
                is_checked: true
            };

            mockRepo.createOrUpdate.mockResolvedValue(data);

            const result = await service.updateProduct(data);

            expect(mockRepo.createOrUpdate).toHaveBeenCalledWith(data);
            expect(result).toEqual(data);
        });

        it('should throw if repository fails', async () => {
            mockRepo.createOrUpdate.mockRejectedValue(new Error('Update failed'));

            await expect(service.updateProduct({
                list_id: '99',
                product_id: 'X'
            })).rejects.toThrow('Update failed');
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product from a list', async () => {
            mockRepo.delete.mockResolvedValue(undefined);

            await service.deleteProduct('10', 'A');

            expect(mockRepo.delete).toHaveBeenCalledWith('10', 'A');
        });

        it('should throw if repository fails', async () => {
            mockRepo.delete.mockRejectedValue(new Error('Delete error'));

            await expect(service.deleteProduct('10', 'A')).rejects.toThrow('Delete error');
        });
    });
});
