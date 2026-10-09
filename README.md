# Deskwell

A full-stack e-commerce app: a **React + Vite** front end and a **Node.js + Express + SQLite** REST API. Browse products, filter and search, build a cart and place orders that are saved in a database.

**Live demo:** https://deskwell-store.vercel.app/

## Features
- Products loaded from the API (SQLite database, seeded on first run)
- Debounced search, category filter, max-price slider and sorting
- Product detail dialog, cart drawer, saved items (wishlist)
- Checkout form that creates a real order: the server validates input, checks stock, calculates totals and reduces stock in one database transaction
- Cart and saved items persist in the browser (localStorage); orders and stock persist in the database
- Accessible and responsive UI

## Architecture
```
React app (Vite)  --/api-->  Express API  -->  SQLite (server/data/deskwell.db)
```
- Prices and totals are always calculated on the server, never trusted from the browser.
- Orders run inside a database transaction, so a failed order leaves stock unchanged.

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | One product |
| POST | `/api/orders` | Create an order. Body: `{ "customer": { "name", "email" }, "items": [{ "productId", "qty" }] }` |
| GET | `/api/orders/:id` | Fetch an order with its items |

Errors return `{ "error": "message" }` with status 400 (bad input), 404 (not found) or 409 (not enough stock).

## Database
Three tables: `products`, `orders` and `order_items` (foreign keys, `CHECK` constraints on price, stock and quantity). See `server/db.js`.

## Project structure
```
src/                 React front end (components, context, hooks, utils, api.js)
server/
  index.js           starts the server
  app.js             routes, validation, order transaction
  db.js              schema and seeding
  seed.js            starting products
  app.test.js        API tests (node:test)
```

## Run locally
You need two terminals.
```bash
# Terminal 1: API (http://localhost:3001)
cd server
npm install
npm run dev

# Terminal 2: front end (http://localhost:5173)
npm install
npm run dev
```
Tests:
```bash
npm test             # front-end unit tests (Vitest)
npm run test:server  # API tests
```

## Configuration
| Variable | Where | Purpose |
|----------|-------|---------|
| `PORT` | server | API port (default 3001) |
| `CORS_ORIGIN` | server | Comma-separated allowed front-end origins (default: any) |
| `VITE_API_URL` | front end build | Address of the deployed API (leave empty in development) |

## Ideas for next steps
- User accounts with login (JWT) and order history
- Deploy the API with a hosted database (for example PostgreSQL)
- Admin page to manage products and stock
