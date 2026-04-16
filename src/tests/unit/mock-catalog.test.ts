import { describe, expect, it } from "vitest";
import {
  getMockCategories,
  getMockFeaturedProducts,
  getMockProductBySlug,
  getMockProductList
} from "@/lib/store/mock-catalog";

describe("mock catalog", () => {
  it("returns available categories", () => {
    const categories = getMockCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((category) => category.slug === "eletronicos")).toBe(true);
  });

  it("returns featured products respecting limit", () => {
    const featured = getMockFeaturedProducts(2);
    expect(featured).toHaveLength(2);
  });

  it("filters by textual query", () => {
    const results = getMockProductList({ query: "cafeteira" });
    expect(results).toHaveLength(1);
    expect(results[0]?.slug).toBe("cafeteira-smart-1l");
  });

  it("filters by category slug", () => {
    const results = getMockProductList({ categorySlug: "moda" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.categorySlugs.includes("moda"))).toBe(true);
  });

  it("orders products by lower price first", () => {
    const results = getMockProductList({ sort: "price_asc" });
    expect(results[0]?.priceCents).toBeLessThanOrEqual(results[1]?.priceCents ?? Number.MAX_SAFE_INTEGER);
  });

  it("orders products by higher price first", () => {
    const results = getMockProductList({ sort: "price_desc" });
    expect(results[0]?.priceCents).toBeGreaterThanOrEqual(results[1]?.priceCents ?? 0);
  });

  it("returns product details by slug", () => {
    const product = getMockProductBySlug("fone-bluetooth-pro");
    expect(product).not.toBeNull();
    expect(product?.sku).toBe("ELE-FONE-001");
  });

  it("returns null for unknown slug", () => {
    const product = getMockProductBySlug("slug-inexistente");
    expect(product).toBeNull();
  });
});
