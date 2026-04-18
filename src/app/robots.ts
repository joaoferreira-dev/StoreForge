import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/produtos", "/produto/", "/carrinho", "/checkout"],
        disallow: ["/admin", "/admin/", "/admin/login", "/api/metrics"]
      }
    ],
    sitemap: `${appConfig.appUrl}/sitemap.xml`
  };
}
