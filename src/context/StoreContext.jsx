import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { cartReducer } from "./cartReducer";
import { readStorage, useLocalStorage } from "../hooks/useLocalStorage";
import { cartTotals } from "../utils/cartTotals";
import { createOrder, fetchProducts } from "../api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, null, () => readStorage("deskwell-cart", {}));
  const [wish, setWish] = useLocalStorage("deskwell-wish", []);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    try {
      localStorage.setItem("deskwell-cart", JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  // silent = refresh data in the background without showing the loading state
  const loadProducts = useCallback(async (silent = false) => {
    if (!silent) setStatus("loading");
    try {
      setProducts(await fetchProducts());
      setStatus("ready");
    } catch {
      if (!silent) setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const notify = useCallback((msg) => setToast({ msg, id: Date.now() }), []);

  const getProduct = useCallback((id) => products.find((p) => p.id === Number(id)), [products]);

  const addToCart = useCallback(
    (id, qty = 1) => {
      const product = getProduct(id);
      if (!product || product.stock === 0) return;
      if ((cart[id] || 0) >= product.stock) {
        notify(`Only ${product.stock} in stock`);
        return;
      }
      dispatch({ type: "add", id, qty, stock: product.stock });
      notify(`${product.name} added to cart`);
    },
    [cart, getProduct, notify]
  );

  const setQty = useCallback(
    (id, qty) => {
      const product = getProduct(id);
      if (product) dispatch({ type: "setQty", id, qty, stock: product.stock });
    },
    [getProduct]
  );

  const toggleWish = useCallback(
    (id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    [setWish]
  );

  // Sends the cart to the server. Throws an Error with a readable message on failure.
  const placeOrder = useCallback(
    async (customer) => {
      const items = Object.entries(cart).map(([id, qty]) => ({ productId: Number(id), qty }));
      try {
        const order = await createOrder(customer, items);
        dispatch({ type: "clear" });
        await loadProducts(true); // pick up the reduced stock
        return order;
      } catch (err) {
        await loadProducts(true); // stock may have changed; show the latest
        throw err;
      }
    },
    [cart, loadProducts]
  );

  const totals = useMemo(() => cartTotals(cart, products), [cart, products]);

  const value = {
    products, status, loadProducts, getProduct,
    cart, wish, toast, totals,
    addToCart, setQty, toggleWish, placeOrder, notify,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
