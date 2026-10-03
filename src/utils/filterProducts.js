// Pure function: easy to unit test and reuse.
export function filterProducts(products, { query, category, maxPrice, sort, wishOnly, wish }) {
  const q = query.trim().toLowerCase();

  const list = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.price <= maxPrice &&
      (!wishOnly || wish.includes(p.id)) &&
      (!q || `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q))
  );

  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}
