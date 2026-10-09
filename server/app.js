import express from "express";
import cors from "cors";

export const FREE_DELIVERY_AT = 999;
export const DELIVERY_FEE = 79;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toProduct = ({ description, ...rest }) => ({ ...rest, desc: description });

// Validates the request body and merges duplicate product lines.
function parseOrder(body) {
  const name = typeof body?.customer?.name === "string" ? body.customer.name.trim() : "";
  const email = typeof body?.customer?.email === "string" ? body.customer.email.trim() : "";
  if (!name || name.length > 100) throw new HttpError(400, "Please enter your name (max 100 characters).");
  if (!EMAIL_RE.test(email) || email.length > 200) throw new HttpError(400, "Please enter a valid email address.");

  const raw = body?.items;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) {
    throw new HttpError(400, "Your order must contain between 1 and 50 items.");
  }

  const merged = new Map();
  for (const { productId, qty } of raw) {
    if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new HttpError(400, "Each item needs a valid productId and a quantity from 1 to 99.");
    }
    merged.set(productId, (merged.get(productId) || 0) + qty);
  }
  return { customer: { name, email }, items: [...merged].map(([productId, qty]) => ({ productId, qty })) };
}

export function createApp(db) {
  const app = express();
  const origins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());
  app.use(cors({ origin: origins?.length ? origins : true }));
  app.use(express.json({ limit: "20kb" }));

  const listProducts = db.prepare("SELECT * FROM products ORDER BY id");
  const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
  const insertOrder = db.prepare(
    "INSERT INTO orders (customer_name, customer_email, subtotal, delivery, total) VALUES (?, ?, ?, ?, ?)"
  );
  const insertItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)"
  );
  const reduceStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
  const getOrder = db.prepare("SELECT * FROM orders WHERE id = ?");
  const getOrderItems = db.prepare(`
    SELECT oi.product_id AS productId, p.name, oi.quantity AS qty, oi.unit_price AS unitPrice
    FROM order_items oi JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ? ORDER BY oi.id
  `);

  // All-or-nothing: if any line fails, nothing is saved and stock is untouched.
  const placeOrder = db.transaction(({ customer, items }) => {
    let subtotal = 0;
    const lines = items.map(({ productId, qty }) => {
      const product = getProduct.get(productId);
      if (!product) throw new HttpError(404, `Product ${productId} does not exist.`);
      if (product.stock < qty) {
        const left = product.stock === 0 ? "is sold out" : `only has ${product.stock} left`;
        throw new HttpError(409, `"${product.name}" ${left}.`);
      }
      subtotal += product.price * qty; // price always comes from the database, never from the client
      return { product, qty };
    });

    const delivery = subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
    const total = subtotal + delivery;
    const orderId = insertOrder.run(customer.name, customer.email, subtotal, delivery, total).lastInsertRowid;
    for (const { product, qty } of lines) {
      insertItem.run(orderId, product.id, qty, product.price);
      reduceStock.run(qty, product.id);
    }
    return Number(orderId);
  });

  const formatOrder = (row) => ({
    id: row.id,
    customer: { name: row.customer_name, email: row.customer_email },
    items: getOrderItems.all(row.id),
    subtotal: row.subtotal,
    delivery: row.delivery,
    total: row.total,
    createdAt: row.created_at,
  });

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.get("/api/products", (_req, res) => res.json(listProducts.all().map(toProduct)));

  app.get("/api/products/:id", (req, res) => {
    const row = getProduct.get(Number(req.params.id));
    if (!row) throw new HttpError(404, "Product not found.");
    res.json(toProduct(row));
  });

  app.post("/api/orders", (req, res) => {
    const orderId = placeOrder(parseOrder(req.body));
    res.status(201).json(formatOrder(getOrder.get(orderId)));
  });

  app.get("/api/orders/:id", (req, res) => {
    const row = getOrder.get(Number(req.params.id));
    if (!row) throw new HttpError(404, "Order not found.");
    res.json(formatOrder(row));
  });

  app.use("/api", () => {
    throw new HttpError(404, "Not found.");
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    const status = err.status && err.status < 500 ? err.status : 500;
    if (status === 500) console.error(err);
    res.status(status).json({
      error: status === 500 ? "Something went wrong on the server." : err.type === "entity.parse.failed" ? "Invalid JSON." : err.message,
    });
  });

  return app;
}
