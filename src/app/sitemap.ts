import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config/env";
import { getProductList } from "@/lib/store/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = appConfig.appUrl;
  const now = new Date();
  const products = await getProductList({ sort: "newest" });

  const staticRoutes: MetadataRoute.Sitemap = ["", "/produtos", "/carrinho", "/checkout"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produto/${product.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [...staticRoutes, ...productRoutes];
}
