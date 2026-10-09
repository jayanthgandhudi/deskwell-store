import { MAX_PRICE } from "../constants";
import { money } from "../utils/format";

export default function Controls({ categories, filters, setFilters }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <section className="controls" aria-label="Filters">
      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className="chip"
            aria-pressed={filters.category === c}
            onClick={() => update({ category: c })}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="selects">
        <label>
          Max price
          <input
            type="range"
            min="500"
            max={MAX_PRICE}
            step="100"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          />
          <output>{money(filters.maxPrice)}</output>
        </label>
        <label>
          Sort
          <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
        <button
          className="chip"
          aria-pressed={filters.wishOnly}
          onClick={() => update({ wishOnly: !filters.wishOnly })}
        >
          Saved items
        </button>
      </div>
    </section>
  );
}
