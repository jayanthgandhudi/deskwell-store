import { describe, expect, it } from "vitest";
import { cartReducer } from "./cartReducer";

describe("cartReducer", () => {
  it("adds a product", () => {
    expect(cartReducer({}, { type: "add", id: 1, qty: 2 })).toEqual({ 1: 2 });
  });

  it("never exceeds stock (product 8 has 3 in stock)", () => {
    const state = cartReducer({ 8: 2 }, { type: "add", id: 8, qty: 5 });
    expect(state[8]).toBe(3);
  });

  it("ignores sold-out products (product 12)", () => {
    expect(cartReducer({}, { type: "add", id: 12, qty: 1 })).toEqual({});
  });

  it("removes a line when quantity drops to 0", () => {
    expect(cartReducer({ 1: 1, 2: 1 }, { type: "setQty", id: 1, qty: 0 })).toEqual({ 2: 1 });
  });

  it("clears the cart", () => {
    expect(cartReducer({ 1: 1 }, { type: "clear" })).toEqual({});
  });
});
