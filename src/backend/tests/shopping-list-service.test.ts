import { ShoppingListService } from '../services/shopping-list-service';

const mockShoppingListRepository = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../repositories/shopping-list-repository', () => ({
    ShoppingListRepository: jest.fn().mockImplementation(() => mockShoppingListRepository),
}));

describe('ShoppingListService', () => {
    let shoppingListService: ShoppingListService;

    beforeEach(() => {
        jest.clearAllMocks();
        shoppingListService = new ShoppingListService();
    });

    describe('getShoppingListsByUserId', () => {
        it('should return formatted shopping lists when user has lists', async () => {
            const mockShoppingLists = [
                {
                    id: '1',
                    name: 'Weekly Groceries',
                    shoppingListProducts: [
                        { product: { name: 'Milk' } },
                        { product: { name: 'Bread' } }
                    ]
                },
                {
                    id: '2',
                    name: 'Party Supplies',
                    shoppingListProducts: null
                }
            ];

            const expectedResult = [
                {
                    id: '1',
                    title: 'Weekly Groceries',
                    productList: ['Milk', 'Bread']
                },
                {
                    id: '2',
                    title: 'Party Supplies',
                    productList: []
                }
            ];

            mockShoppingListRepository.findByUserId.mockResolvedValue(mockShoppingLists);

            const result = await shoppingListService.getShoppingListsByUserId('user123');

            expect(mockShoppingListRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual(expectedResult);
        });

        it('should return empty array when user has no lists', async () => {
            mockShoppingListRepository.findByUserId.mockResolvedValue([]);

            const result = await shoppingListService.getShoppingListsByUserId('user123');

            expect(mockShoppingListRepository.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual([]);
        });

        it('should handle repository errors', async () => {
            const error = new Error('Database connection failed');
            mockShoppingListRepository.findByUserId.mockRejectedValue(error);

            await expect(shoppingListService.getShoppingListsByUserId('user123')).rejects.toThrow('Database connection failed');
        });
    });

    describe('createShoppingList', () => {
        it('should create a new shopping list successfully', async () => {
            const mockCreatedList = {
                id: 'new-list-id',
                name: 'My New List',
                user_id: 'user123',
                is_completed: false,
                added_at: new Date(),
            };

            const expectedResult = {
                id: 'new-list-id',
                title: 'My New List',
                productList: []
            };

            mockShoppingListRepository.create.mockResolvedValue(mockCreatedList);

            const result = await shoppingListService.createShoppingList('My New List', 'user123');

            expect(mockShoppingListRepository.create).toHaveBeenCalledWith('My New List', 'user123');
            expect(result).toEqual(expectedResult);
        });

        it('should handle repository errors during creation', async () => {
            const error = new Error('Database connection failed');
            mockShoppingListRepository.create.mockRejectedValue(error);

            await expect(shoppingListService.createShoppingList('Test List', 'user123')).rejects.toThrow('Database connection failed');
        });

        it('should handle duplicate name errors', async () => {
            const error = new Error('Shopping list with this name already exists');
            mockShoppingListRepository.create.mockRejectedValue(error);

            await expect(shoppingListService.createShoppingList('Duplicate List', 'user123')).rejects.toThrow('Shopping list with this name already exists');
        });
    });

    describe('deleteShoppingList', () => {
        it('should delete a shopping list when user is the owner', async () => {
            const mockShoppingList = {
                id: 'list123',
                name: 'My List',
                user_id: 'user123',
                is_completed: false,
                added_at: new Date(),
            };

            mockShoppingListRepository.findById.mockResolvedValue(mockShoppingList);
            mockShoppingListRepository.delete.mockResolvedValue(undefined);

            await shoppingListService.deleteShoppingList('list123', 'user123');

            expect(mockShoppingListRepository.findById).toHaveBeenCalledWith('list123');
            expect(mockShoppingListRepository.delete).toHaveBeenCalledWith('list123');
        });

        it('should throw error when shopping list does not exist', async () => {
            mockShoppingListRepository.findById.mockResolvedValue(null);

            await expect(shoppingListService.deleteShoppingList('nonexistent', 'user123'))
                .rejects.toThrow('Shopping list not found');

            expect(mockShoppingListRepository.findById).toHaveBeenCalledWith('nonexistent');
            expect(mockShoppingListRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error when user is not the owner', async () => {
            const mockShoppingList = {
                id: 'list123',
                name: 'Someone Else List',
                user_id: 'otherUser',
                is_completed: false,
                added_at: new Date(),
            };

            mockShoppingListRepository.findById.mockResolvedValue(mockShoppingList);

            await expect(shoppingListService.deleteShoppingList('list123', 'user123'))
                .rejects.toThrow('Shopping list does not belong to the user');

            expect(mockShoppingListRepository.findById).toHaveBeenCalledWith('list123');
            expect(mockShoppingListRepository.delete).not.toHaveBeenCalled();
        });
    });
});
