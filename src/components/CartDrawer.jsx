import { useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import { FREE_DELIVERY_AT } from "../constants";
import { money } from "../utils/format";

export default function CartDrawer({ open, onClose }) {
  const { cart, totals, getProduct, setQty, placeOrder, notify } = useStore();
  const closeRef = useRef(null);
  const [step, setStep] = useState("cart"); // cart | details
  const [form, setForm] = useState({ name: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Only show lines whose product still exists on the server
  const entries = Object.entries(cart).filter(([id]) => getProduct(id));
  const remaining = Math.max(0, FREE_DELIVERY_AT - totals.subtotal);

  useEffect(() => {
    if (!open) {
      setStep("cart");
      setError("");
      return;
    }
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (totals.items === 0) setStep("cart");
  }, [totals.items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await placeOrder(form);
      notify(`Order #${order.id} placed: ${money(order.total)}`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className={`overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside
        className={`cart ${open ? "open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!open}
        inert={open ? undefined : ""}
      >
        <header>
          <h2>Your cart</h2>
          <button ref={closeRef} className="btn ghost" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="ship">
          {totals.subtotal === 0
            ? `Free delivery on orders over ${money(FREE_DELIVERY_AT)}`
            : remaining === 0
            ? "You get free delivery on this order."
            : `Add ${money(remaining)} more for free delivery.`}
          <div className="bar">
            <i style={{ width: `${Math.min(100, (totals.subtotal / FREE_DELIVERY_AT) * 100)}%` }} />
          </div>
        </div>

        <div className="lines">
          {entries.length === 0 && <div className="empty">Your cart is empty. Add something from the store.</div>}
          {entries.map(([id, qty]) => {
            const p = getProduct(id);
            return (
              <div className="line" key={id}>
                <div className="thumb" style={{ "--tile": p.tile }} aria-hidden="true">
                  {p.emoji}
                </div>
                <div>
                  <h4>{p.name}</h4>
                  <div className="meta">{money(p.price)} each</div>
                  <button className="remove" onClick={() => setQty(p.id, 0)}>
                    Remove
                  </button>
                </div>
                <div className="qty" role="group" aria-label={`Quantity for ${p.name}`}>
                  <button aria-label="Decrease quantity" onClick={() => setQty(p.id, qty - 1)}>
                    −
                  </button>
                  <output>{qty}</output>
                  <button aria-label="Increase quantity" onClick={() => setQty(p.id, qty + 1)}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="totals">
          <div className="row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
          <div className="row"><span>Delivery</span><span>{totals.delivery ? money(totals.delivery) : "Free"}</span></div>
          <div className="row total"><span>Total</span><span>{money(totals.total)}</span></div>

          {step === "cart" ? (
            <button className="btn dark" disabled={totals.items === 0} onClick={() => setStep("details")}>
              Checkout
            </button>
          ) : (
            <form className="checkout" onSubmit={handleSubmit}>
              <label className="field">
                Name
                <input
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="field">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="btn dark" type="submit" disabled={busy || totals.items === 0}>
                {busy ? "Placing order…" : "Place order"}
              </button>
              <button className="remove" type="button" onClick={() => setStep("cart")}>
                Back to cart
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}
