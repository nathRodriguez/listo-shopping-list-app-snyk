# Listo Shopping List Backend

This backend uses Express and TypeORM for API development. The folder structure is designed for simplicity and separation of concerns.

## Folder Structure
- `config/` — Database and other configurations
- `routes/` — Route definitions and handlers
- `services/` — Business logic (e.g., signup-service.ts)
- `repositories/` — Data access layer (e.g., user-repository.ts)
- `models/` — Data models/entities (e.g., User.ts)
- `utils/` — Helper functions and utilities
- `tests/` — Unit tests
- `main.ts` — Application entry point

## Adding New Routes
1. **Define Data Model:**
   - Add or update entities in `models/` (e.g. `Product.ts`).

2. **Implement Data Access:**
   - Add repositories in `repositories/` (e.g. `ProductRepository.ts`).

3. **Implement Business Logic:**
   - Add services in `services/` (e.g. `ProductService.ts`).

4. **Create Routes:**
   - Add a new file in `routes/`, e.g. `products-routes.ts`.
   - Export an Express Router with your endpoints, calling services from `services/`.

5. **Register the Routes:**
   - Import your router in `main.ts`.
   - Use `app.use('/products', productsRouter)` to register it.

6. **Add Tests:**
   - Add unit tests in `tests/` for services and routes.

## Running Backend & Frontend Together
Use `npm run dev` from the project root to start both backend and frontend with hot reload.
