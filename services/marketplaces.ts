import { env, isConfigured, missingConfigMessage } from "@/lib/env";
import type { ApiResult, ProductOption } from "@/types/travio";

type AmazonPaapiClient = {
  SearchItemsV2: (
    commonParameters: Record<string, string>,
    requestParameters: Record<string, string | number | string[]>
  ) => Promise<Record<string, unknown>>;
};

function numericPrice(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  return fallback;
}

function readPath(source: unknown, path: string[]) {
  return path.reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, source);
}

function amazonPrice(item: Record<string, unknown>) {
  return (
    readPath(item, ["OffersV2", "Listings", "0", "Price", "Money", "Amount"]) ??
    readPath(item, ["OffersV2", "Listings", "0", "Price", "Amount"]) ??
    readPath(item, ["Offers", "Listings", "0", "Price", "Amount"])
  );
}

function stringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value : undefined;
}

function realTimeProductFromRaw(raw: Record<string, unknown>, query: string, index: number): ProductOption {
  const offer = (raw.offer as Record<string, unknown> | undefined) ?? {};
  const priceRange = arrayValue(raw.typical_price_range);
  const title = stringValue(raw.product_title, raw.title, raw.name) ?? `${query} product option`;
  const price = numericPrice(
    raw.product_price ??
      raw.price ??
      raw.offer_price ??
      offer.price ??
      offer.extracted_price ??
      priceRange?.[0],
    [19.99, 29.99, 39.99][index % 3]
  );
  const source = stringValue(raw.source, raw.merchant, raw.seller, offer.store_name, offer.source) ?? "Google Shopping";
  const photos = arrayValue(raw.product_photos) ?? arrayValue(raw.images) ?? arrayValue(raw.thumbnails);
  const image = stringValue(raw.product_photo, raw.thumbnail, raw.image, raw.image_url, photos?.[0]);
  const rating = stringValue(raw.product_rating, raw.rating);
  const reviews = stringValue(raw.product_num_reviews, raw.reviews, raw.reviews_count);

  return {
    id: stringValue(raw.product_id, raw.product_page_url, raw.url, raw.link) ?? `rapid-product-${Date.now()}-${index}`,
    name: title,
    price_per_unit: price,
    total_price: price,
    delivery_days: Math.max(2, Math.min(14, 4 + index * 2)),
    supplier: source.includes("Amazon")
      ? "Amazon"
      : source.includes("Ali") || source.includes("Alibaba")
        ? "Alibaba"
        : source.includes("Temu")
          ? "Temu"
          : "Google Shopping",
    description:
      stringValue(raw.product_description, raw.description, raw.snippet, raw.product_page_url, raw.url) ??
      `Live result from ${source}${rating ? ` • ${rating} stars` : ""}${reviews ? ` • ${reviews} reviews` : ""}.`,
    category: stringValue(raw.category, raw.product_type) ?? "Shopping",
    image_url: image,
    availability: stringValue(raw.availability, raw.stock_status) ?? "Available"
  };
}

function optionFromRaw(raw: Record<string, unknown>, supplier: ProductOption["supplier"], query: string): ProductOption {
  const name =
    (raw.product_title as string) ??
    (raw.title as string) ??
    (raw.name as string) ??
    `${supplier} option for ${query}`;
  const price = numericPrice(raw.sale_price ?? raw.price ?? raw.price_per_unit, supplier === "Amazon" ? 25 : 18);
  const deliveryDays = Math.max(
    1,
    Math.round(numericPrice(raw.delivery_days ?? raw.estimated_delivery_days ?? raw.shipping_days, supplier === "Temu" ? 10 : 14))
  );

  return {
    id: String(raw.product_id ?? raw.asin ?? raw.id ?? `${supplier}-${Date.now()}`),
    name,
    price_per_unit: price,
    total_price: price,
    delivery_days: deliveryDays,
    supplier,
    description: String(raw.description ?? raw.product_detail_url ?? `Matched ${query} on ${supplier}.`),
    category: String(raw.category ?? "General"),
    image_url: (raw.product_main_image_url as string) ?? (raw.image as string) ?? (raw.image_url as string),
    availability: (raw.availability as string) ?? "Available"
  };
}

export async function searchRealTimeProducts(query: string): Promise<{ products: ProductOption[]; error?: string }> {
  if (!isConfigured(env.rapidApiKey)) {
    return { products: [], error: missingConfigMessage("RapidAPI Real-Time Product Search") };
  }

  const host = env.rapidApiHost ?? "real-time-product-search.p.rapidapi.com";
  const params = new URLSearchParams({
    q: query,
    country: "us",
    language: "en",
    limit: "6"
  });

  const response = await fetch(`https://${host}/search?${params.toString()}`, {
    headers: {
      "x-rapidapi-host": host,
      "x-rapidapi-key": env.rapidApiKey!
    }
  });

  if (!response.ok) {
    const message = await response.text();
    return { products: [], error: `Real-Time Product Search failed with ${response.status}: ${message.slice(0, 160)}` };
  }

  const json = await response.json();
  const rawProducts =
    arrayValue(json?.data?.products) ??
    arrayValue(json?.data?.organic_results) ??
    arrayValue(json?.data?.shopping_results) ??
    arrayValue(json?.data) ??
    arrayValue(json?.products) ??
    arrayValue(json?.shopping_results) ??
    [];

  const products = rawProducts
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .slice(0, 6)
    .map((item, index) => realTimeProductFromRaw(item, query, index));

  if (products.length === 0) {
    return { products, error: "Real-Time Product Search returned no matching products." };
  }

  return { products };
}

export async function searchAliExpress(query: string): Promise<ApiResult<ProductOption>> {
  if (!isConfigured(env.aliexpressAppKey) || !isConfigured(env.aliexpressAppSecret)) {
    return { error: missingConfigMessage("AliExpress affiliate API") };
  }

  const params = new URLSearchParams({
    method: "aliexpress.affiliate.product.query",
    app_key: env.aliexpressAppKey!,
    keywords: query,
    tracking_id: env.aliexpressTrackingId ?? env.aliexpressAppKey!,
    target_currency: "USD",
    target_language: "EN",
    ship_to_country: "US",
    page_size: "1",
    timestamp: new Date().toISOString()
  });

  const response = await fetch(`https://api.aliexpress.com/sync?${params.toString()}`);
  if (!response.ok) {
    return { error: `AliExpress API failed with ${response.status}.` };
  }

  const json = await response.json();
  const rawProduct =
    json?.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product?.[0] ??
    json?.result?.products?.[0];

  if (!rawProduct) {
    return { error: "AliExpress returned no matching products." };
  }

  return { data: optionFromRaw(rawProduct, "Alibaba", query) };
}

export async function searchAmazon(query: string): Promise<ApiResult<ProductOption>> {
  if (
    !isConfigured(env.amazonAccessKey) ||
    !isConfigured(env.amazonSecretKey) ||
    !isConfigured(env.amazonPartnerTag)
  ) {
    return { error: missingConfigMessage("Amazon Product Advertising API") };
  }

  const amazonPaapi = require("amazon-paapi") as AmazonPaapiClient;
  const json = await amazonPaapi.SearchItemsV2(
    {
      AccessKey: env.amazonAccessKey!,
      SecretKey: env.amazonSecretKey!,
      PartnerTag: env.amazonPartnerTag!,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com"
    },
    {
      Keywords: query,
      SearchIndex: "All",
      ItemCount: 1,
      Resources: ["Images.Primary.Medium", "ItemInfo.Title", "OffersV2.Listings.Price", "Offers.Listings.Price"]
    }
  );

  const item = (json?.SearchResult as Record<string, unknown> | undefined)?.Items as
    | Array<Record<string, unknown>>
    | undefined;
  const firstItem = item?.[0];
  if (!firstItem) {
    return { error: "Amazon returned no matching products." };
  }

  const itemInfo = firstItem.ItemInfo as Record<string, Record<string, string>> | undefined;
  const images = firstItem.Images as Record<string, Record<string, Record<string, string>>> | undefined;

  return {
    data: optionFromRaw(
      {
        asin: firstItem.ASIN,
        title: itemInfo?.Title?.DisplayValue,
        price: amazonPrice(firstItem),
        image: images?.Primary?.Medium?.URL,
        delivery_days: 7,
        description: firstItem.DetailPageURL
      },
      "Amazon",
      query
    )
  };
}

export async function searchTemu(query: string): Promise<ApiResult<ProductOption>> {
  if (!isConfigured(env.temuRapidApiKey) || !isConfigured(env.temuRapidApiHost)) {
    return { error: missingConfigMessage("RapidAPI Temu endpoint") };
  }

  const response = await fetch(`https://${env.temuRapidApiHost}/search?keyword=${encodeURIComponent(query)}`, {
    headers: {
      "x-rapidapi-key": env.temuRapidApiKey!,
      "x-rapidapi-host": env.temuRapidApiHost!
    }
  });

  if (!response.ok) {
    return { error: `Temu RapidAPI endpoint failed with ${response.status}.` };
  }

  const json = await response.json();
  const item = json?.data?.products?.[0] ?? json?.products?.[0] ?? json?.result?.[0];
  if (!item) {
    return { error: "Temu returned no matching products." };
  }

  return { data: optionFromRaw(item, "Temu", query) };
}

export async function searchMarketplaces(query: string) {
  const settled = await Promise.allSettled([searchAliExpress(query), searchAmazon(query), searchTemu(query)]);
  const products: ProductOption[] = [];
  const errors: string[] = [];

  settled.forEach((result) => {
    if (result.status === "rejected") {
      errors.push(result.reason instanceof Error ? result.reason.message : "Marketplace request failed.");
      return;
    }

    if (result.value.data) {
      products.push(result.value.data);
    }

    if (result.value.error) {
      errors.push(result.value.error);
    }
  });

  return { products, errors };
}
