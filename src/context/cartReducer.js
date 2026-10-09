// cart shape: { [productId]: quantity }
// `stock` is passed in each action because products now come from the server.
export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      if (!action.stock) return state;
      const next = Math.min(action.stock, (state[action.id] || 0) + action.qty);
      return { ...state, [action.id]: next };
    }
    case "setQty": {
      if (action.qty <= 0) {
        const { [action.id]: _removed, ...rest } = state;
        return rest;
      }
      return { ...state, [action.id]: Math.min(action.qty, action.stock) };
    }
    case "clear":
      return {};
    default:
      return state;
  }
}
