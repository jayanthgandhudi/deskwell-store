import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "./db.js";
import { createApp } from "./app.js";

let server, base;

before(() => {
  server = createApp(openDb(":memory:")).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => {
  server.close();
  server.closeAllConnections?.();
});

const get = (path) => fetch(base + path);
const post = (path, body) =>
  fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const customer = { name: "Asha", email: "asha@example.com" };

describe("products", () => {
  test("lists all seeded products", async () => {
    const res = await get("/api/products");
    assert.equal(res.status, 200);
    const list = await res.json();
    assert.equal(list.length, 12);
    assert.ok(list[0].desc, "description is exposed as `desc`");
  });

  test("returns 404 for an unknown product", async () => {
    assert.equal((await get("/api/products/999")).status, 404);
  });
});

describe("orders", () => {
  test("creates an order, computes totals on the server and reduces stock", async () => {
    // product 11 = 899 (below free-delivery limit), product 2 = 1299
    const res = await post("/api/orders", { customer, items: [{ productId: 11, qty: 1 }] });
    assert.equal(res.status, 201);
    const order = await res.json();
    assert.deepEqual([order.subtotal, order.delivery, order.total], [899, 79, 978]);

    const product = await (await get("/api/products/11")).json();
    assert.equal(product.stock, 59);

    const fetched = await (await get(`/api/orders/${order.id}`)).json();
    assert.equal(fetched.items[0].name, "Extended Desk Mat");
  });

  test("gives free delivery from 999", async () => {
    const order = await (await post("/api/orders", { customer, items: [{ productId: 2, qty: 1 }] })).json();
    assert.equal(order.delivery, 0);
    assert.equal(order.total, 1299);
  });

  test("rejects more than the stock and changes nothing", async () => {
    // product 8 has 3 in stock; product 2 line is valid but must roll back too
    const res = await post("/api/orders", {
      customer,
      items: [{ productId: 2, qty: 1 }, { productId: 8, qty: 4 }],
    });
    assert.equal(res.status, 409);
    const stock2 = (await (await get("/api/products/2")).json()).stock;
    assert.equal(stock2, 39, "earlier order took 1 of 40; the failed order must not take another");
    assert.equal((await (await get("/api/products/8")).json()).stock, 3);
  });

  test("rejects a sold-out product", async () => {
    const res = await post("/api/orders", { customer, items: [{ productId: 12, qty: 1 }] });
    assert.equal(res.status, 409);
  });

  test("rejects an invalid email", async () => {
    const res = await post("/api/orders", {
      customer: { name: "Asha", email: "not-an-email" },
      items: [{ productId: 1, qty: 1 }],
    });
    assert.equal(res.status, 400);
  });

  test("rejects an empty order and bad quantities", async () => {
    assert.equal((await post("/api/orders", { customer, items: [] })).status, 400);
    assert.equal((await post("/api/orders", { customer, items: [{ productId: 1, qty: 0 }] })).status, 400);
  });

  test("merges duplicate lines for the same product", async () => {
    const order = await (await post("/api/orders", {
      customer,
      items: [{ productId: 5, qty: 1 }, { productId: 5, qty: 2 }],
    })).json();
    assert.equal(order.items.length, 1);
    assert.equal(order.items[0].qty, 3);
  });

  test("returns 404 for an unknown order", async () => {
    assert.equal((await get("/api/orders/9999")).status, 404);
  });
});
