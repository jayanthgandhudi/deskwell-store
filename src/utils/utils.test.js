import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../data/products";
import { cartTotals } from "./cartTotals";
import { filterProducts } from "./filterProducts";

const base = { query: "", category: "All", maxPrice: 8000, sort: "featured", wishOnly: false, wish: [] };

describe("filterProducts", () => {
  it("filters by category", () => {
    const list = filterProducts(PRODUCTS, { ...base, category: "Audio" });
    expect(list.every((p) => p.category === "Audio")).toBe(true);
  });

  it("searches by name, case-insensitively", () => {
    const list = filterProducts(PRODUCTS, { ...base, query: "KEYBOARD" });
    expect(list.length).toBeGreaterThan(0);
  });

  it("sorts by price low to high", () => {
    const prices = filterProducts(PRODUCTS, { ...base, sort: "low" }).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("shows only saved items", () => {
    const list = filterProducts(PRODUCTS, { ...base, wishOnly: true, wish: [2, 4] });
    expect(list.map((p) => p.id).sort()).toEqual([2, 4]);
  });
});

describe("cartTotals", () => {
  it("charges delivery under the free-delivery limit", () => {
    // product 11 costs 899, below 999
    expect(cartTotals({ 11: 1 })).toMatchObject({ subtotal: 899, delivery: 79, total: 978 });
  });

  it("gives free delivery at or above 999", () => {
    expect(cartTotals({ 2: 1 })).toMatchObject({ subtotal: 1299, delivery: 0, total: 1299 });
  });

  it("is zero for an empty cart", () => {
    expect(cartTotals({})).toEqual({ items: 0, subtotal: 0, delivery: 0, total: 0 });
  });
});
