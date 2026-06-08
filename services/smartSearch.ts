import type { ProductOption } from "@/types/travio";

export type SmartSearchIntent = {
  brand?: string;
  budgetMax?: number;
  category?: string;
  country: string;
  giftIntent?: boolean;
  minRating?: number;
  query: string;
  sort: "best-rated" | "most-popular" | "price-high" | "price-low";
};

const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Toys", "Books"];
const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "Dell", "HP", "Lenovo", "Xiaomi", "Anker"];

export function parseSmartSearch(query: string): SmartSearchIntent {
  const normalized = query.toLowerCase();
  const budgetMatch = normalized.match(/(?:under|less than|below|max|budget)\s*\$?\s*(\d+)/i);
  const cheapIntent = /\b(cheap|affordable|budget|low cost)\b/i.test(query);
  const category = categories.find((item) => normalized.includes(item.toLowerCase()));
  const brand = brands.find((item) => normalized.includes(item.toLowerCase()));
  const countryMatch = normalized.match(/\b(?:ship(?:ping)? to|deliver(?:y)? to|in)\s+([a-zA-Z ]{2,24})/);
  const giftIntent = /\b(gift|birthday|anniversary|present|for my|for her|for him|for kids)\b/i.test(query);
  const minRating = /\b(4 stars|4 star|four stars|best rated|top rated)\b/i.test(query) ? 4 : undefined;
  const sort = /high to low|price high/i.test(query)
    ? "price-high"
    : /low to high|cheapest|price low|cheap|affordable/i.test(query)
      ? "price-low"
      : /popular|trending|best seller/i.test(query)
        ? "most-popular"
        : "best-rated";

  return {
    brand,
    budgetMax: budgetMatch ? Number(budgetMatch[1]) : cheapIntent ? 50 : undefined,
    category,
    country: countryMatch?.[1]?.trim() || "US",
    giftIntent,
    minRating,
    query,
    sort
  };
}

export function applySmartFilters(products: ProductOption[], intent: SmartSearchIntent) {
  let filtered = [...products];

  if (intent.budgetMax) {
    filtered = filtered.filter((product) => product.total_price <= intent.budgetMax!);
  }

  if (intent.category) {
    filtered = filtered.filter((product) => product.category?.toLowerCase().includes(intent.category!.toLowerCase()) || true);
  }

  if (intent.brand) {
    filtered = filtered.sort((a, b) => Number(b.name.includes(intent.brand!)) - Number(a.name.includes(intent.brand!)));
  }

  if (intent.sort === "price-low") {
    filtered.sort((a, b) => a.total_price - b.total_price);
  } else if (intent.sort === "price-high") {
    filtered.sort((a, b) => b.total_price - a.total_price);
  } else if (intent.sort === "most-popular") {
    filtered.sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0));
  } else {
    filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  return filtered;
}
