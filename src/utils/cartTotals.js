import { DELIVERY_FEE, FREE_DELIVERY_AT, getProduct } from "../data/products";

export function cartTotals(cart) {
  let items = 0;
  let subtotal = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const product = getProduct(id);
    if (!product) continue;
    items += qty;
    subtotal += product.price * qty;
  }
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  return { items, subtotal, delivery, total: subtotal + delivery };
}
