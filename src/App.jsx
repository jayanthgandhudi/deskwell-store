import { useMemo, useState } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import { MAX_PRICE, FREE_DELIVERY_AT } from "./constants";
import { useDebounce } from "./hooks/useDebounce";
import { useStore } from "./context/StoreContext";
import { filterProducts } from "./utils/filterProducts";
import { money } from "./utils/format";

export default function App() {
  const { products, status, loadProducts, wish, toast } = useStore();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    maxPrice: MAX_PRICE,
    sort: "featured",
    wishOnly: false,
  });
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);

  const visible = useMemo(
    () => filterProducts(products, { ...filters, query: debouncedQuery, wish }),
    [products, filters, debouncedQuery, wish]
  );

  return (
    <>
      <Header query={query} onQuery={setQuery} onOpenCart={() => setCartOpen(true)} />

      <section className="hero">
        <h1>Gear for a better desk.</h1>
        <p>
          Keyboards, lighting and audio picked for long study and coding sessions. Free delivery over{" "}
          {money(FREE_DELIVERY_AT)}.
        </p>
      </section>

      {status === "ready" && <Controls categories={categories} filters={filters} setFilters={setFilters} />}

      {status === "loading" && (
        <main>
          <p className="count" role="status">Loading products…</p>
        </main>
      )}
      {status === "error" && (
        <main>
          <div className="empty">
            <p>We could not load the products. Check that the server is running.</p>
            <button className="btn dark" onClick={() => loadProducts()}>Try again</button>
          </div>
        </main>
      )}
      {status === "ready" && <ProductGrid products={visible} onOpen={setSelected} />}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toast toast={toast} />
    </>
  );
}
