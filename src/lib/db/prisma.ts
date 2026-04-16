import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof globalThis & {
  prismaGlobal?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

export const prisma = globalForPrisma.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}
