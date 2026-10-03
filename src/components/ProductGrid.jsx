import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onOpen }) {
  return (
    <main>
      <p className="count" aria-live="polite">
        {products.length} product{products.length === 1 ? "" : "s"}
      </p>
      {products.length === 0 ? (
        <div className="empty">No products match. Try a different search or raise the max price.</div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} />
          ))}
        </div>
      )}
    </main>
  );
}
