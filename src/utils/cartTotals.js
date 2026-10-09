import { DELIVERY_FEE, FREE_DELIVERY_AT } from "../constants";

// cart: { [productId]: quantity }, products: list loaded from the API
export function cartTotals(cart, products) {
  const byId = new Map(products.map((p) => [p.id, p]));
  let items = 0;
  let subtotal = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const product = byId.get(Number(id));
    if (!product) continue;
    items += qty;
    subtotal += product.price * qty;
  }
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  return { items, subtotal, delivery, total: subtotal + delivery };
}
