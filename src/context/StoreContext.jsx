import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { cartReducer } from "./cartReducer";
import { readStorage, useLocalStorage } from "../hooks/useLocalStorage";
import { cartTotals } from "../utils/cartTotals";
import { getProduct } from "../data/products";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, null, () => readStorage("deskwell-cart", {}));
  const [wish, setWish] = useLocalStorage("deskwell-wish", []);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("deskwell-cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  const notify = useCallback((msg) => setToast({ msg, id: Date.now() }), []);

  const addToCart = useCallback(
    (id, qty = 1) => {
      const product = getProduct(id);
      if (!product || product.stock === 0) return;
      if ((cart[id] || 0) >= product.stock) {
        notify(`Only ${product.stock} in stock`);
        return;
      }
      dispatch({ type: "add", id, qty });
      notify(`${product.name} added to cart`);
    },
    [cart, notify]
  );

  const setQty = useCallback((id, qty) => dispatch({ type: "setQty", id, qty }), []);

  const toggleWish = useCallback(
    (id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    [setWish]
  );

  const checkout = useCallback(() => {
    const { total } = cartTotals(cart);
    dispatch({ type: "clear" });
    return total;
  }, [cart]);

  const totals = useMemo(() => cartTotals(cart), [cart]);

  const value = { cart, wish, toast, totals, addToCart, setQty, toggleWish, checkout, notify };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
