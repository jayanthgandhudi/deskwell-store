import { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import { money, stars } from "../utils/format";

export default function ProductModal({ product, onClose }) {
  const ref = useRef(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useStore();

  // Open/close the native <dialog> when `product` changes
  useEffect(() => {
    const dialog = ref.current;
    if (product && !dialog.open) {
      setQty(1);
      dialog.showModal();
    }
    if (!product && dialog.open) dialog.close();
  }, [product]);

  const handleAdd = () => {
    addToCart(product.id, qty);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="dTitle"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {product && (
        <>
          <button className="close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
          <div className="detail">
            <div className="art" style={{ "--tile": product.tile }} aria-hidden="true">
              {product.emoji}
            </div>
            <div className="body">
              <div className="meta">{product.category}</div>
              <h2 id="dTitle">{product.name}</h2>
              <div className="meta">
                {stars(product.rating)} {product.rating} · {product.reviews.toLocaleString("en-IN")} reviews
              </div>
              <p>{product.desc}</p>
              <div className="price">{money(product.price)}</div>
              {product.stock === 0 && <div className="stock-low">Sold out</div>}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="stock-low">Only {product.stock} left</div>
              )}
              <div className="actions">
                <div className="qty" role="group" aria-label="Quantity">
                  <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <output>{qty}</output>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                  >
                    +
                  </button>
                </div>
                <button className="btn" disabled={product.stock === 0} onClick={handleAdd}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
