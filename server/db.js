import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_PRODUCTS } from "./seed.js";

const DEFAULT_FILE = fileURLToPath(new URL("./data/deskwell.db", import.meta.url));

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    price       INTEGER NOT NULL CHECK (price > 0),
    rating      REAL    NOT NULL DEFAULT 0,
    reviews     INTEGER NOT NULL DEFAULT 0,
    emoji       TEXT    NOT NULL,
    tile        TEXT    NOT NULL,
    stock       INTEGER NOT NULL CHECK (stock >= 0),
    description TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name  TEXT    NOT NULL,
    customer_email TEXT    NOT NULL,
    subtotal       INTEGER NOT NULL,
    delivery       INTEGER NOT NULL,
    total          INTEGER NOT NULL,
    created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
`;

export function openDb(file = DEFAULT_FILE) {
  if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true });

  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);

  const { count } = db.prepare("SELECT COUNT(*) AS count FROM products").get();
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO products (id, name, category, price, rating, reviews, emoji, tile, stock, description)
      VALUES (@id, @name, @category, @price, @rating, @reviews, @emoji, @tile, @stock, @description)
    `);
    db.transaction((rows) => rows.forEach((r) => insert.run(r)))(SEED_PRODUCTS);
  }
  return db;
}
