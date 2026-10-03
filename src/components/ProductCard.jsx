import { useStore } from "../context/StoreContext";
import { money, stars } from "../utils/format";

export default function ProductCard({ product: p, onOpen }) {
  const { wish, toggleWish, addToCart } = useStore();
  const saved = wish.includes(p.id);
  const soldOut = p.stock === 0;

  return (
    <article className="card">
      <div className="tile-wrap">
        <button
          className="tile"
          style={{ "--tile": p.tile }}
          onClick={() => onOpen(p)}
          aria-label={`View ${p.name}`}
        >
          <span aria-hidden="true">{p.emoji}</span>
        </button>
        <button
          className="wish"
          aria-pressed={saved}
          aria-label={`${saved ? "Remove from saved" : "Save"} ${p.name}`}
          onClick={() => toggleWish(p.id)}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="info">
        <h3>{p.name}</h3>
        <div className="meta">
          <span aria-label={`${p.rating} out of 5`}>{stars(p.rating)}</span> {p.rating} (
          {p.reviews.toLocaleString("en-IN")})
        </div>
        <div className="price-row">
          <span className="price">{money(p.price)}</span>
          <button className="btn" disabled={soldOut} onClick={() => addToCart(p.id)}>
            {soldOut ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
