import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import { runtimeConfig } from "@/lib/config/env";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!runtimeConfig.hasDatabaseUrl) {
    return NextResponse.json({
      enabled: false,
      generatedAt: new Date().toISOString()
    });
  }

  const [products, activeProducts, categories, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count()
  ]);

  return NextResponse.json({
    enabled: true,
    generatedAt: new Date().toISOString(),
    totals: {
      products,
      activeProducts,
      categories,
      orders,
      users
    }
  });
}
