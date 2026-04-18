"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { runtimeConfig } from "@/lib/config/env";
import {
  parseBooleanFromCheckbox,
  parseMoneyToCents,
  parseNonNegativeInt,
  parseOptionalMoneyToCents,
  parseOptionalString,
  parseOrderStatus,
  parseRequiredString,
  parseSlug,
  parseStringArray
} from "@/lib/admin/form-parsers";

function ensureDatabaseConfigured() {
  if (!runtimeConfig.hasDatabaseUrl) {
    throw new Error("Backoffice indisponível sem DATABASE_URL configurada.");
  }
}

function revalidateBackofficeAndStore() {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
}

export async function createCategoryAction(formData: FormData) {
  ensureDatabaseConfigured();

  const name = parseRequiredString(formData, "name", "nome");
  const slug = parseSlug(formData, "slug", "slug");
  const description = parseOptionalString(formData, "description");

  await prisma.category.create({
    data: {
      name,
      slug,
      description
    }
  });

  revalidateBackofficeAndStore();
}

export async function updateCategoryAction(formData: FormData) {
  ensureDatabaseConfigured();

  const categoryId = parseRequiredString(formData, "categoryId", "categoria");
  const name = parseRequiredString(formData, "name", "nome");
  const slug = parseSlug(formData, "slug", "slug");
  const description = parseOptionalString(formData, "description");

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name,
      slug,
      description
    }
  });

  revalidateBackofficeAndStore();
}

export async function deleteCategoryAction(formData: FormData) {
  ensureDatabaseConfigured();

  const categoryId = parseRequiredString(formData, "categoryId", "categoria");

  await prisma.category.delete({
    where: { id: categoryId }
  });

  revalidateBackofficeAndStore();
}

export async function createProductAction(formData: FormData) {
  ensureDatabaseConfigured();

  const name = parseRequiredString(formData, "name", "nome");
  const slug = parseSlug(formData, "slug", "slug");
  const sku = parseRequiredString(formData, "sku", "SKU");
  const shortDescription = parseRequiredString(formData, "shortDescription", "descrição curta");
  const description = parseRequiredString(formData, "description", "descrição");
  const priceCents = parseMoneyToCents(formData, "price", "preço");
  const compareAtPriceCents = parseOptionalMoneyToCents(formData, "compareAtPrice", "preço comparativo");
  const stockQuantity = parseNonNegativeInt(formData, "stockQuantity", "estoque");
  const isActive = parseBooleanFromCheckbox(formData, "isActive");
  const categoryIds = parseStringArray(formData, "categoryIds");

  await prisma.product.create({
    data: {
      name,
      slug,
      sku,
      shortDescription,
      description,
      priceCents,
      compareAtPriceCents,
      stockQuantity,
      isActive,
      categories: categoryIds.length
        ? {
            create: categoryIds.map((categoryId) => ({
              category: {
                connect: { id: categoryId }
              }
            }))
          }
        : undefined
    }
  });

  revalidateBackofficeAndStore();
}

export async function updateProductAction(formData: FormData) {
  ensureDatabaseConfigured();

  const productId = parseRequiredString(formData, "productId", "produto");
  const name = parseRequiredString(formData, "name", "nome");
  const slug = parseSlug(formData, "slug", "slug");
  const sku = parseRequiredString(formData, "sku", "SKU");
  const shortDescription = parseRequiredString(formData, "shortDescription", "descrição curta");
  const description = parseRequiredString(formData, "description", "descrição");
  const priceCents = parseMoneyToCents(formData, "price", "preço");
  const compareAtPriceCents = parseOptionalMoneyToCents(formData, "compareAtPrice", "preço comparativo");
  const stockQuantity = parseNonNegativeInt(formData, "stockQuantity", "estoque");
  const isActive = parseBooleanFromCheckbox(formData, "isActive");
  const categoryIds = parseStringArray(formData, "categoryIds");

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        sku,
        shortDescription,
        description,
        priceCents,
        compareAtPriceCents,
        stockQuantity,
        isActive
      }
    });

    await tx.productCategory.deleteMany({
      where: { productId }
    });

    if (categoryIds.length > 0) {
      await tx.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          productId,
          categoryId
        })),
        skipDuplicates: true
      });
    }
  });

  revalidateBackofficeAndStore();
}

export async function deleteProductAction(formData: FormData) {
  ensureDatabaseConfigured();

  const productId = parseRequiredString(formData, "productId", "produto");

  await prisma.product.delete({
    where: { id: productId }
  });

  revalidateBackofficeAndStore();
}

export async function updateOrderStatusAction(formData: FormData) {
  ensureDatabaseConfigured();

  const orderId = parseRequiredString(formData, "orderId", "pedido");
  const status = parseOrderStatus(formData, "status");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status
    }
  });

  revalidatePath("/admin");
}
