import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { runtimeConfig } from "@/lib/config/env";
import {
  getMockCategories,
  getMockFeaturedProducts,
  getMockProductBySlug,
  getMockProductList
} from "@/lib/store/mock-catalog";

export type ProductSort = "newest" | "price_asc" | "price_desc";

export type ProductListFilters = {
  query?: string;
  categorySlug?: string;
  sort?: ProductSort;
};

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  stockQuantity: number;
  categorySlugs: string[];
  categoryNames: string[];
};

export type ProductDetails = ProductListItem & {
  description: string;
  sku: string;
};

export type StoreCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

type ProductWithCategories = Prisma.ProductGetPayload<{
  include: { categories: { include: { category: true } } };
}>;

function toProductListItem(product: ProductWithCategories): ProductListItem {
  const categories = product.categories.map((relation) => relation.category);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents,
    stockQuantity: product.stockQuantity,
    categorySlugs: categories.map((category) => category.slug),
    categoryNames: categories.map((category) => category.name)
  };
}

function getOrderBy(sort: ProductSort | undefined) {
  if (sort === "price_asc") {
    return [{ priceCents: "asc" as const }, { createdAt: "desc" as const }];
  }

  if (sort === "price_desc") {
    return [{ priceCents: "desc" as const }, { createdAt: "desc" as const }];
  }

  return [{ createdAt: "desc" as const }];
}

export async function getStoreCategories(): Promise<StoreCategory[]> {
  if (!runtimeConfig.hasDatabaseUrl) {
    return getMockCategories();
  }

  return prisma.category.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      description: true
    },
    orderBy: [{ name: "asc" }]
  });
}

export async function getFeaturedProducts(limit = 4): Promise<ProductListItem[]> {
  if (!runtimeConfig.hasDatabaseUrl) {
    return getMockFeaturedProducts(limit);
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, stockQuantity: { gt: 0 } },
    include: { categories: { include: { category: true } } },
    orderBy: [{ createdAt: "desc" }],
    take: limit
  });

  return products.map(toProductListItem);
}

export async function getProductList(filters: ProductListFilters): Promise<ProductListItem[]> {
  if (!runtimeConfig.hasDatabaseUrl) {
    return getMockProductList(filters);
  }

  const normalizedQuery = filters.query?.trim();

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      stockQuantity: { gt: 0 },
      ...(normalizedQuery
        ? {
            OR: [
              {
                name: {
                  contains: normalizedQuery,
                  mode: "insensitive"
                }
              },
              {
                shortDescription: {
                  contains: normalizedQuery,
                  mode: "insensitive"
                }
              }
            ]
          }
        : {}),
      ...(filters.categorySlug
        ? {
            categories: {
              some: {
                category: {
                  slug: filters.categorySlug
                }
              }
            }
          }
        : {})
    },
    include: { categories: { include: { category: true } } },
    orderBy: getOrderBy(filters.sort)
  });

  return products.map(toProductListItem);
}

export async function getProductBySlug(slug: string): Promise<ProductDetails | null> {
  if (!runtimeConfig.hasDatabaseUrl) {
    return getMockProductBySlug(slug);
  }

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { categories: { include: { category: true } } }
  });

  if (!product || product.stockQuantity <= 0) {
    return null;
  }

  const base = toProductListItem(product);

  return {
    ...base,
    description: product.description,
    sku: product.sku
  };
}
