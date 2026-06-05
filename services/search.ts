import { askClaudeForProducts } from "@/services/claude";
import { searchMarketplaces } from "@/services/marketplaces";
import type { ProductOption, Supplier } from "@/types/travio";

const suppliers: Supplier[] = ["Alibaba", "Amazon", "Temu"];

function fallbackProducts(query: string, existing: ProductOption[]): ProductOption[] {
  const bySupplier = new Map<Supplier, ProductOption>();
  existing.forEach((product) => bySupplier.set(product.supplier, product));

  suppliers.forEach((supplier, index) => {
    if (!bySupplier.has(supplier)) {
      const unitPrice = [12.5, 18.75, 10.25][index];
      bySupplier.set(supplier, {
        id: `fallback-${supplier}-${Date.now()}`,
        name: `${query} - ${supplier} option`,
        price_per_unit: unitPrice,
        total_price: unitPrice,
        delivery_days: [18, 6, 11][index],
        supplier,
        description:
          "Demo product generated while API credentials are placeholders. Add real keys in .env for live search results.",
        category: "General",
        availability: "Demo"
      });
    }
  });

  return suppliers.map((supplier) => bySupplier.get(supplier)!);
}

export async function searchTravioProducts(query: string) {
  const { products: marketplaceProducts, errors: marketplaceErrors } = await searchMarketplaces(query);
  const errors = [...marketplaceErrors];

  try {
    const claudeProducts = await askClaudeForProducts(query, marketplaceProducts);
    return { products: claudeProducts, errors };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Claude product parsing failed.");
  }

  return {
    products: fallbackProducts(query, marketplaceProducts),
    errors
  };
}
