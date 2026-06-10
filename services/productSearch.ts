import { env, isConfigured } from "@/lib/env";
import type { Platform, Product } from "@/types/travio";

const INTENT_KEYWORDS = [
  "find",
  "buy",
  "search",
  "price",
  "cheap",
  "best",
  "recommend",
  "deal",
  "compare",
  "shop",
];

export function shouldSearchProducts(text: string): boolean {
  const lower = text.toLowerCase();
  return INTENT_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function detectPlatform(source: string | undefined, url: string | undefined): Platform {
  const haystack = `${source ?? ""} ${url ?? ""}`.toLowerCase();
  if (haystack.includes("aliexpress")) return "AliExpress";
  if (haystack.includes("alibaba")) return "Alibaba";
  if (haystack.includes("temu")) return "Temu";
  return "Amazon";
}

function parsePrice(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const numeric = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  }
  return 0;
}

interface RapidProductOffer {
  price?: string | number;
  offer_page_url?: string;
  store_name?: string;
}

interface RapidProduct {
  product_id?: string;
  product_title?: string;
  product_photos?: string[];
  product_photo?: string;
  product_rating?: number | string;
  product_page_url?: string;
  offer?: RapidProductOffer;
}

function demoProducts(query: string): Product[] {
  const platforms: Platform[] = ["Amazon", "AliExpress", "Temu", "Alibaba"];
  const prices = [29.99, 19.5, 14.99, 24.0];
  return platforms.map((platform, index) => ({
    id: makeId(),
    title: `${query.trim()} — top pick on ${platform}`,
    price: prices[index],
    currency: "USD",
    image_url: `https://picsum.photos/seed/${encodeURIComponent(
      `${query}-${platform}`,
    )}/400/300`,
    product_url: "https://www.google.com/search?q=" + encodeURIComponent(query),
    platform,
    rating: 4 + (index % 2 === 0 ? 0.5 : 0.3),
  }));
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!isConfigured(env.rapidApiKey)) {
    return demoProducts(query);
  }

  try {
    const url = `https://${env.rapidApiHost}/search?q=${encodeURIComponent(
      query,
    )}&country=us&language=en&limit=10`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": env.rapidApiKey,
        "x-rapidapi-host": env.rapidApiHost,
      },
    });

    if (!response.ok) {
      return demoProducts(query);
    }

    const json = (await response.json()) as {
      data?: { products?: RapidProduct[] };
    };
    const products = json.data?.products ?? [];
    if (products.length === 0) {
      return demoProducts(query);
    }

    return products.slice(0, 10).map((product) => {
      const productUrl = product.offer?.offer_page_url ?? product.product_page_url;
      return {
        id: product.product_id ?? makeId(),
        title: product.product_title ?? "Product",
        price: parsePrice(product.offer?.price),
        currency: "USD",
        image_url: product.product_photos?.[0] ?? product.product_photo ?? null,
        product_url: productUrl ?? null,
        platform: detectPlatform(product.offer?.store_name, productUrl),
        rating:
          typeof product.product_rating === "number"
            ? product.product_rating
            : parsePrice(product.product_rating) || null,
      };
    });
  } catch {
    return demoProducts(query);
  }
}
