import { describe, expect, it } from "vitest";
import { cartTotals } from "./cartTotals";
import { filterProducts } from "./filterProducts";

// A small list like the one the API returns
const PRODUCTS = [
  { id: 1, name: "Mechanical Keyboard", category: "Keyboards", price: 3499, rating: 4.7, desc: "Compact layout" },
  { id: 2, name: "Wireless Mouse", category: "Accessories", price: 1299, rating: 4.4, desc: "Quiet clicks" },
  { id: 3, name: "Headphones", category: "Audio", price: 6999, rating: 4.6, desc: "Noise cancelling" },
  { id: 11, name: "Desk Mat", category: "Accessories", price: 899, rating: 4.5, desc: "Non-slip base" },
];

const base = { query: "", category: "All", maxPrice: 8000, sort: "featured", wishOnly: false, wish: [] };

describe("filterProducts", () => {
  it("filters by category", () => {
    const list = filterProducts(PRODUCTS, { ...base, category: "Accessories" });
    expect(list.map((p) => p.id)).toEqual([2, 11]);
  });

  it("searches by name, case-insensitively", () => {
    const list = filterProducts(PRODUCTS, { ...base, query: "KEYBOARD" });
    expect(list.map((p) => p.id)).toEqual([1]);
  });

  it("filters by max price", () => {
    const list = filterProducts(PRODUCTS, { ...base, maxPrice: 1500 });
    expect(list.map((p) => p.id)).toEqual([2, 11]);
  });

  it("sorts by price low to high", () => {
    const prices = filterProducts(PRODUCTS, { ...base, sort: "low" }).map((p) => p.price);
    expect(prices).toEqual([899, 1299, 3499, 6999]);
  });

  it("shows only saved items", () => {
    const list = filterProducts(PRODUCTS, { ...base, wishOnly: true, wish: [2, 3] });
    expect(list.map((p) => p.id).sort()).toEqual([2, 3]);
  });
});

describe("cartTotals", () => {
  it("charges delivery under the free-delivery limit", () => {
    expect(cartTotals({ 11: 1 }, PRODUCTS)).toMatchObject({ subtotal: 899, delivery: 79, total: 978 });
  });

  it("gives free delivery at or above 999", () => {
    expect(cartTotals({ 2: 1 }, PRODUCTS)).toMatchObject({ subtotal: 1299, delivery: 0, total: 1299 });
  });

  it("ignores products that no longer exist", () => {
    expect(cartTotals({ 999: 2, 2: 1 }, PRODUCTS)).toMatchObject({ items: 1, subtotal: 1299 });
  });

  it("is zero for an empty cart", () => {
    expect(cartTotals({}, PRODUCTS)).toEqual({ items: 0, subtotal: 0, delivery: 0, total: 0 });
  });
});
