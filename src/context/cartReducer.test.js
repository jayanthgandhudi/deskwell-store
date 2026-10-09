import { describe, expect, it } from "vitest";
import { cartReducer } from "./cartReducer";

describe("cartReducer", () => {
  it("adds a product", () => {
    expect(cartReducer({}, { type: "add", id: 1, qty: 2, stock: 10 })).toEqual({ 1: 2 });
  });

  it("never exceeds stock", () => {
    const state = cartReducer({ 8: 2 }, { type: "add", id: 8, qty: 5, stock: 3 });
    expect(state[8]).toBe(3);
  });

  it("ignores sold-out products", () => {
    expect(cartReducer({}, { type: "add", id: 12, qty: 1, stock: 0 })).toEqual({});
  });

  it("caps a quantity change at stock", () => {
    expect(cartReducer({ 1: 2 }, { type: "setQty", id: 1, qty: 9, stock: 4 })).toEqual({ 1: 4 });
  });

  it("removes a line when quantity drops to 0", () => {
    expect(cartReducer({ 1: 1, 2: 1 }, { type: "setQty", id: 1, qty: 0, stock: 5 })).toEqual({ 2: 1 });
  });

  it("clears the cart", () => {
    expect(cartReducer({ 1: 1 }, { type: "clear" })).toEqual({});
  });
});
