import { prisma } from "@/lib/db/prisma";
import { runtimeConfig } from "@/lib/config/env";

export const ORDER_STATUS_OPTIONS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"] as const;
export type OrderStatusOption = (typeof ORDER_STATUS_OPTIONS)[number];

export type BackofficeCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productsCount: number;
  createdAt: Date;
};

export type BackofficeProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  stockQuantity: number;
  isActive: boolean;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  createdAt: Date;
};

export type BackofficeOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatusOption;
  paymentMethod: "CARD" | "PIX";
  guestEmail: string | null;
  totalCents: number;
  itemsCount: number;
  placedAt: Date;
};

export type BackofficeSnapshot = {
  databaseConfigured: boolean;
  categories: BackofficeCategory[];
  products: BackofficeProduct[];
  orders: BackofficeOrder[];
};

export async function getBackofficeSnapshot(): Promise<BackofficeSnapshot> {
  if (!runtimeConfig.hasDatabaseUrl) {
    return {
      databaseConfigured: false,
      categories: [],
      products: [],
      orders: []
    };
  }

  const [categories, products, orders] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    }),
    prisma.product.findMany({
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        shortDescription: true,
        description: true,
        priceCents: true,
        compareAtPriceCents: true,
        stockQuantity: true,
        isActive: true,
        createdAt: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    }),
    prisma.order.findMany({
      orderBy: [{ placedAt: "desc" }],
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentMethod: true,
        guestEmail: true,
        totalCents: true,
        placedAt: true,
        _count: {
          select: {
            items: true
          }
        }
      }
    })
  ]);

  return {
    databaseConfigured: true,
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productsCount: category._count.products,
      createdAt: category.createdAt
    })),
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      shortDescription: product.shortDescription,
      description: product.description,
      priceCents: product.priceCents,
      compareAtPriceCents: product.compareAtPriceCents,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      categories: product.categories.map((relation) => relation.category),
      createdAt: product.createdAt
    })),
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      guestEmail: order.guestEmail,
      totalCents: order.totalCents,
      itemsCount: order._count.items,
      placedAt: order.placedAt
    }))
  };
}
