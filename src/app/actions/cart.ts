"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ensureSessionId, getOrCreateActiveCartForSession, getSessionIdFromRequest } from "@/lib/store/cart";

function revalidateStorePages() {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/carrinho");
  revalidatePath("/checkout");
}

export async function addToCartAction(formData: FormData) {
  const productId = formData.get("productId");
  const redirectTo = formData.get("redirectTo");

  if (typeof productId !== "string" || productId.length === 0) {
    throw new Error("Produto inválido para carrinho.");
  }

  const sessionId = await ensureSessionId();
  const cart = await getOrCreateActiveCartForSession(sessionId);

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true, priceCents: true, stockQuantity: true }
    });

    if (!product || product.stockQuantity <= 0) {
      throw new Error("Produto indisponível.");
    }

    const existing = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      }
    });

    const nextQuantity = (existing?.quantity ?? 0) + 1;
    if (nextQuantity > product.stockQuantity) {
      throw new Error("Quantidade solicitada acima do estoque disponível.");
    }

    await tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id
        }
      },
      update: {
        quantity: nextQuantity,
        unitPriceCents: product.priceCents
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        unitPriceCents: product.priceCents
      }
    });
  });

  revalidateStorePages();
  if (typeof redirectTo === "string" && redirectTo.length > 0) {
    redirect(redirectTo);
  }

  redirect("/carrinho");
}

export async function updateCartItemQuantityAction(formData: FormData) {
  const cartItemId = formData.get("cartItemId");
  const operation = formData.get("operation");

  if (typeof cartItemId !== "string" || cartItemId.length === 0) {
    throw new Error("Item inválido.");
  }

  if (operation !== "increment" && operation !== "decrement") {
    throw new Error("Operação de carrinho inválida.");
  }

  const sessionId = await getSessionIdFromRequest();
  if (!sessionId) {
    throw new Error("Sessão de carrinho não encontrada.");
  }

  const cart = await prisma.cart.findFirst({
    where: { sessionId, status: "ACTIVE" },
    select: { id: true }
  });

  if (!cart) {
    throw new Error("Carrinho não encontrado.");
  }

  await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: { select: { stockQuantity: true, priceCents: true } } }
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new Error("Item do carrinho não encontrado.");
    }

    const nextQuantity = operation === "increment" ? cartItem.quantity + 1 : cartItem.quantity - 1;

    if (nextQuantity <= 0) {
      await tx.cartItem.delete({
        where: { id: cartItemId }
      });
      return;
    }

    if (nextQuantity > cartItem.product.stockQuantity) {
      throw new Error("Quantidade solicitada acima do estoque disponível.");
    }

    await tx.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: nextQuantity,
        unitPriceCents: cartItem.product.priceCents
      }
    });
  });

  revalidateStorePages();
}

export async function removeCartItemAction(formData: FormData) {
  const cartItemId = formData.get("cartItemId");
  if (typeof cartItemId !== "string" || cartItemId.length === 0) {
    throw new Error("Item inválido.");
  }

  const sessionId = await getSessionIdFromRequest();
  if (!sessionId) {
    throw new Error("Sessão de carrinho não encontrada.");
  }

  const cart = await prisma.cart.findFirst({
    where: { sessionId, status: "ACTIVE" },
    select: { id: true }
  });

  if (!cart) {
    throw new Error("Carrinho não encontrado.");
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    select: { id: true, cartId: true }
  });

  if (!item || item.cartId !== cart.id) {
    throw new Error("Item do carrinho não encontrado.");
  }

  await prisma.cartItem.delete({
    where: { id: item.id }
  });

  revalidateStorePages();
}
