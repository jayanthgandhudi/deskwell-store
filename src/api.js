// In development, Vite proxies /api to the Express server (see vite.config.js).
// In production, set VITE_API_URL to the deployed API address.
const BASE = import.meta.env.VITE_API_URL ?? "";

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the server. Is it running?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const fetchProducts = () => request("/api/products");

export const createOrder = (customer, items) =>
  request("/api/orders", { method: "POST", body: JSON.stringify({ customer, items }) });
