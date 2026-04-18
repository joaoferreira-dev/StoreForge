"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { parseGuestEmail, parsePostalCode, parseRequiredString } from "@/lib/store/checkout-validation";
import { getSessionIdFromRequest } from "@/lib/store/cart";

const DEFAULT_SHIPPING_CENTS = 1990;

function parsePaymentMethod(value: FormDataEntryValue | null) {
  if (value === "CARD" || value === "PIX") {
    return value;
  }

  throw new Error("Método de pagamento inválido.");
}

function generateOrderNumber() {
  return `SF-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function completeCheckoutAction(formData: FormData) {
  const sessionId = await getSessionIdFromRequest();
  if (!sessionId) {
    throw new Error("Sessão de carrinho não encontrada.");
  }

  const guestEmail = parseGuestEmail(formData.get("guestEmail"));
  const recipientName = parseRequiredString(formData.get("recipientName"), "nome");
  const street = parseRequiredString(formData.get("street"), "rua");
  const number = parseRequiredString(formData.get("number"), "número");
  const district = parseRequiredString(formData.get("district"), "bairro");
  const city = parseRequiredString(formData.get("city"), "cidade");
  const state = parseRequiredString(formData.get("state"), "estado");
  const postalCode = parsePostalCode(formData.get("postalCode"));
  const complementValue = formData.get("complement");
  const complement =
    typeof complementValue === "string" && complementValue.trim().length > 0
      ? complementValue.trim()
      : null;
  const paymentMethod = parsePaymentMethod(formData.get("paymentMethod"));

  const cart = await prisma.cart.findFirst({
    where: { sessionId, status: "ACTIVE" },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              stockQuantity: true
            }
          }
        }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  const subtotalCents = cart.items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
  const shippingCents = DEFAULT_SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;
  const orderNumber = generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        guestEmail,
        status: "PENDING",
        subtotalCents,
        shippingCents,
        totalCents,
        paymentMethod
      }
    });

    await tx.orderAddress.createMany({
      data: [
        {
          orderId: createdOrder.id,
          type: "SHIPPING",
          recipientName,
          street,
          number,
          complement,
          district,
          city,
          state,
          postalCode
        },
        {
          orderId: createdOrder.id,
          type: "BILLING",
          recipientName,
          street,
          number,
          complement,
          district,
          city,
          state,
          postalCode
        }
      ]
    });

    await tx.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        productName: item.product.name,
        productSku: item.product.sku,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        totalCents: item.unitPriceCents * item.quantity
      }))
    });

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        method: paymentMethod,
        amountCents: totalCents,
        status: "REQUIRES_ACTION"
      }
    });

    for (const item of cart.items) {
      const decrementResult = await tx.product.updateMany({
        where: {
          id: item.productId,
          stockQuantity: {
            gte: item.quantity
          }
        },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });

      if (decrementResult.count === 0) {
        throw new Error(`Estoque insuficiente para ${item.product.name}.`);
      }
    }

    await tx.cart.update({
      where: { id: cart.id },
      data: { status: "CONVERTED" }
    });

    return createdOrder;
  });

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/carrinho");
  revalidatePath("/checkout");
  redirect(`/checkout?success=1&order=${order.orderNumber}`);
}
