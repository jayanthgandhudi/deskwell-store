import { useStore } from "../context/StoreContext";

export default function Header({ query, onQuery, onOpenCart }) {
  const { totals } = useStore();
  return (
    <header className="top">
      <div className="logo">
        Desk<span>well</span>
      </div>
      <div className="search">
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search keyboards, lamps, headphones"
          aria-label="Search products"
        />
      </div>
      <button className="icon-btn" onClick={onOpenCart} aria-label={`Open cart, ${totals.items} items`}>
        Cart <span className="badge">{totals.items}</span>
      </button>
    </header>
  );
}
