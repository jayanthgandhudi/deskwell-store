export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const stars = (rating) => {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
};
