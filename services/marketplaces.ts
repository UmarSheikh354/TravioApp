import { env, isConfigured, missingConfigMessage } from "@/lib/env";
import type { ApiResult, ProductOption } from "@/types/travio";

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
    image_url: (raw.product_main_image_url as string) ?? (raw.image as string) ?? (raw.image_url as string),
    availability: (raw.availability as string) ?? "Available"
  };
}

export async function searchAliExpress(query: string): Promise<ApiResult<ProductOption>> {
  if (!isConfigured(env.aliexpressAppKey) || !isConfigured(env.aliexpressTrackingId)) {
    return { error: missingConfigMessage("AliExpress affiliate API") };
  }

  const params = new URLSearchParams({
    method: "aliexpress.affiliate.product.query",
    app_key: env.aliexpressAppKey!,
    keywords: query,
    tracking_id: env.aliexpressTrackingId!,
    target_currency: "USD",
    target_language: "EN",
    ship_to_country: "US",
    page_size: "1",
    timestamp: new Date().toISOString()
  });

  const response = await fetch(`https://api-sg.aliexpress.com/sync?${params.toString()}`);
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
    !isConfigured(env.amazonAssociateTag)
  ) {
    return { error: missingConfigMessage("Amazon Product Advertising API") };
  }

  const response = await fetch("https://webservices.amazon.com/paapi5/searchitems", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"
    },
    body: JSON.stringify({
      Keywords: query,
      PartnerTag: env.amazonAssociateTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
      Resources: ["Images.Primary.Medium", "ItemInfo.Title", "Offers.Listings.Price"]
    })
  });

  if (!response.ok) {
    return { error: `Amazon Product Advertising API failed with ${response.status}.` };
  }

  const json = await response.json();
  const item = json?.SearchResult?.Items?.[0];
  if (!item) {
    return { error: "Amazon returned no matching products." };
  }

  return {
    data: optionFromRaw(
      {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue,
        price: item.Offers?.Listings?.[0]?.Price?.Amount,
        image: item.Images?.Primary?.Medium?.URL,
        delivery_days: 7,
        description: item.DetailPageURL
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
