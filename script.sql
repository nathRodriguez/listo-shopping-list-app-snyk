-- Enable the uuid-ossp extension if not already enabled (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL  -- Encrypted in backend
);

-- Products table
-- is_predefined: true for app-wide products, false for user-created
-- user_id: null for predefined, set for user-created
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_predefined BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, name)  -- Prevent duplicate names per user or global for predefined
);

-- Shopping lists table
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)  -- Prevent duplicate list names per user
);

-- Shopping list products table (junction for products in lists with additional fields)
-- Composite primary key: (list_id, product_id)
-- unit is a free text field for user input
CREATE TABLE shopping_list_products (
    list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price DECIMAL(10,2),  -- Optional, can be null
    quantity DECIMAL(10,2),  -- The amount, e.g., 2.5
    unit VARCHAR(50),     -- Free text for unit, e.g., kg, pieces
    is_checked BOOLEAN NOT NULL DEFAULT FALSE,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (list_id, product_id),
    CHECK (price IS NULL OR price > 0),
    CHECK (quantity IS NULL OR quantity > 0)
);

-- Indexes for performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX idx_shopping_list_product_list_id ON shopping_list_products(list_id);
CREATE INDEX idx_shopping_list_product_product_id ON shopping_list_products(product_id);

-- Insert predefined products
INSERT INTO products (name, is_predefined) VALUES
('Milk', TRUE),
('Bread', TRUE),
('Eggs', TRUE),
('Cheese', TRUE),
('Butter', TRUE),
('Chicken', TRUE),
('Beef', TRUE),
('Rice', TRUE),
('Pasta', TRUE),
('Tomatoes', TRUE),
('Apples', TRUE),
('Bananas', TRUE),
('Oranges', TRUE),
('Potatoes', TRUE),
('Onions', TRUE),
('Carrots', TRUE),
('Lettuce', TRUE),
('Yogurt', TRUE),
('Coffee', TRUE),
('Tea', TRUE),
('Sugar', TRUE),
('Salt', TRUE),
('Flour', TRUE),
('Olive Oil', TRUE),
('Vegetable Oil', TRUE),
('Cereal', TRUE),
('Oats', TRUE),
('Chocolate', TRUE),
('Juice', TRUE),
('Water Bottles', TRUE),
('Soda', TRUE),
('Butter Milk', TRUE),
('Cream Cheese', TRUE),
('Ham', TRUE),
('Turkey Slices', TRUE),
('Fish Fillets', TRUE),
('Shrimp', TRUE),
('Beans', TRUE),
('Lentils', TRUE),
('Chickpeas', TRUE),
('Corn', TRUE),
('Peas', TRUE),
('Broccoli', TRUE),
('Spinach', TRUE),
('Cucumber', TRUE),
('Bell Peppers', TRUE),
('Mushrooms', TRUE),
('Zucchini', TRUE),
('Avocado', TRUE),
('Grapes', TRUE),
('Pineapple', TRUE),
('Strawberries', TRUE),
('Blueberries', TRUE),
('Canned Tuna', TRUE),
('Canned Corn', TRUE),
('Canned Tomatoes', TRUE),
('Tomato Sauce', TRUE),
('Ketchup', TRUE),
('Mayonnaise', TRUE),
('Mustard', TRUE),
('Soy Sauce', TRUE),
('Vinegar', TRUE),
('Brown Sugar', TRUE),
('Honey', TRUE),
('Peanut Butter', TRUE),
('Jam', TRUE),
('Tortillas', TRUE),
('Crackers', TRUE),
('Chips', TRUE),
('Nuts', TRUE),
('Granola Bars', TRUE),
('Ice Cream', TRUE),
('Frozen Vegetables', TRUE),
('Frozen Pizza', TRUE),
('Soap', TRUE),
('Shampoo', TRUE),
('Toilet Paper', TRUE),
('Paper Towels', TRUE),
('Dish Soap', TRUE);
