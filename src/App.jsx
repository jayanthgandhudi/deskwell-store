import { useMemo, useState } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import ProductGrid from "./components/ProductGrid";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import { MAX_PRICE, PRODUCTS, FREE_DELIVERY_AT } from "./data/products";
import { useDebounce } from "./hooks/useDebounce";
import { useStore } from "./context/StoreContext";
import { filterProducts } from "./utils/filterProducts";
import { money } from "./utils/format";

export default function App() {
  const { wish, toast } = useStore();
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

  const products = useMemo(
    () => filterProducts(PRODUCTS, { ...filters, query: debouncedQuery, wish }),
    [filters, debouncedQuery, wish]
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

      <Controls filters={filters} setFilters={setFilters} />
      <ProductGrid products={products} onOpen={setSelected} />

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toast toast={toast} />
    </>
  );
}
