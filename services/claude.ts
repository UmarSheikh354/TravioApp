import { env, isConfigured, missingConfigMessage } from "@/lib/env";
import type { ProductOption } from "@/types/travio";

export const CLAUDE_MODEL = "claude-sonnet-4-20250514";

export const TRAVIO_SYSTEM_PROMPT =
  "You are Travio AI, a global shopping assistant. When user describes any product, find exactly 3 options from Alibaba, Amazon and Temu. Return ONLY this JSON: {products:[{name, price_per_unit, total_price, delivery_days, supplier, description, category}]}";

type ClaudeContentBlock = {
  type: string;
  text?: string;
};

function extractJsonObject(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Claude did not return a JSON object.");
  }

  return candidate.slice(start, end + 1);
}

function normalizeProducts(products: unknown): ProductOption[] {
  if (!Array.isArray(products)) {
    throw new Error("Claude JSON did not contain a products array.");
  }

  return products.slice(0, 3).map((product, index) => {
    const item = product as Partial<ProductOption>;
    const supplier = item.supplier === "Amazon" || item.supplier === "Temu" ? item.supplier : "Alibaba";
    const pricePerUnit = Number(item.price_per_unit) || Number(item.total_price) || 0;

    return {
      id: `${supplier}-${index}-${Date.now()}`,
      name: String(item.name ?? `${supplier} product option`),
      price_per_unit: pricePerUnit,
      total_price: Number(item.total_price) || pricePerUnit,
      delivery_days: Number(item.delivery_days) || 14,
      supplier,
      description: String(item.description ?? `Recommended by Travio AI from ${supplier}.`),
      category: item.category ?? "General",
      image_url: item.image_url,
      availability: item.availability ?? "Available"
    };
  });
}

export async function askClaudeForProducts(query: string, marketplaceContext: ProductOption[]) {
  if (!isConfigured(env.claudeApiKey)) {
    throw new Error(missingConfigMessage("Claude API"));
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.claudeApiKey!,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1200,
      temperature: 0.2,
      system: TRAVIO_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            `User request: ${query}`,
            "Marketplace API context:",
            JSON.stringify({ products: marketplaceContext }, null, 2),
            "Return only the JSON object with exactly 3 products."
          ].join("\n\n")
        }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Claude API failed with ${response.status}: ${message}`);
  }

  const json = await response.json();
  const text = (json.content as ClaudeContentBlock[] | undefined)
    ?.filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n");

  if (!text) {
    throw new Error("Claude returned an empty response.");
  }

  const parsed = JSON.parse(extractJsonObject(text));
  const products = normalizeProducts(parsed.products);

  if (products.length !== 3) {
    throw new Error("Claude did not return exactly 3 products.");
  }

  return products;
}
