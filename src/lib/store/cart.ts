import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export const SESSION_COOKIE_NAME = "store_session_id";

export type CartItemView = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
};

export type CartView = {
  id: string;
  items: CartItemView[];
  subtotalCents: number;
  totalItems: number;
};

function toCartView(
  cart: Awaited<ReturnType<typeof prisma.cart.findUnique>> & {
    items: Array<
      Awaited<ReturnType<typeof prisma.cartItem.findMany>>[number] & {
        product: { id: string; slug: string; name: string };
      }
    >;
  }
): CartView {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productSlug: item.product.slug,
    productName: item.product.name,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    totalCents: item.unitPriceCents * item.quantity
  }));

  return {
    id: cart.id,
    items,
    subtotalCents: items.reduce((total, item) => total + item.totalCents, 0),
    totalItems: items.reduce((total, item) => total + item.quantity, 0)
  };
}

async function getActiveCartBySessionId(sessionId: string) {
  return prisma.cart.findFirst({
    where: {
      sessionId,
      status: "ACTIVE"
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

export async function getSessionIdFromRequest(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function ensureSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (existing) {
    return existing;
  }

  const created = randomUUID();
  cookieStore.set(SESSION_COOKIE_NAME, created, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return created;
}

export async function getCartForCurrentSession(): Promise<CartView | null> {
  const sessionId = await getSessionIdFromRequest();
  if (!sessionId) {
    return null;
  }

  const cart = await getActiveCartBySessionId(sessionId);
  if (!cart) {
    return null;
  }

  return toCartView(cart);
}

export async function getOrCreateActiveCartForSession(sessionId: string) {
  const existing = await getActiveCartBySessionId(sessionId);
  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: {
      sessionId,
      status: "ACTIVE"
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true
            }
          }
        }
      }
    }
  });
}
