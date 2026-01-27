const USD_RATE = 83; // ₹83 = $1 (can be dynamic later)

export const formatPrice = (priceInINR, currency) => {
  if (!priceInINR) return "—";

  if (currency === "USD") {
    return `$${(priceInINR / USD_RATE).toFixed(2)}`;
  }

  return `₹${priceInINR}`;
};
