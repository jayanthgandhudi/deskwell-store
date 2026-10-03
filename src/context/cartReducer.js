import { getProduct } from "../data/products";

// cart shape: { [productId]: quantity }
export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const product = getProduct(action.id);
      if (!product || product.stock === 0) return state;
      const next = Math.min(product.stock, (state[action.id] || 0) + action.qty);
      return { ...state, [action.id]: next };
    }
    case "setQty": {
      if (action.qty <= 0) {
        const { [action.id]: _removed, ...rest } = state;
        return rest;
      }
      const product = getProduct(action.id);
      if (!product) return state;
      return { ...state, [action.id]: Math.min(action.qty, product.stock) };
    }
    case "clear":
      return {};
    default:
      return state;
  }
}
