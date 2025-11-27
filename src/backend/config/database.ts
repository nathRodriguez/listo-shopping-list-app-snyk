import { DataSource } from "typeorm";
import { User } from "../models/User";
import { ShoppingList } from "../models/ShoppingList";
import { Product } from "../models/Product";
import { ShoppingListProduct } from "../models/ShoppingListProduct";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!dbHost) throw new Error('DB_HOST environment variable is required');
if (!dbPort) throw new Error('DB_PORT environment variable is required');
if (!dbUsername) throw new Error('DB_USERNAME environment variable is required');
if (!dbPassword) throw new Error('DB_PASSWORD environment variable is required');
if (!dbName) throw new Error('DB_NAME environment variable is required');

export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbHost,
    port: parseInt(dbPort),
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    synchronize: false,
    logging: false,
    entities: [User, ShoppingList, Product, ShoppingListProduct],
});