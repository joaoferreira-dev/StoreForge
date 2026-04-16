import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "eletronicos",
    name: "Eletronicos",
    description: "Dispositivos para produtividade e entretenimento."
  },
  {
    slug: "casa-e-cozinha",
    name: "Casa e Cozinha",
    description: "Itens essenciais para rotina da casa."
  },
  {
    slug: "moda",
    name: "Moda",
    description: "Pecas versateis para uso diario."
  }
];

const products = [
  {
    slug: "fone-bluetooth-pro",
    sku: "ELE-FONE-001",
    name: "Fone Bluetooth Pro",
    shortDescription: "Cancelamento de ruido e bateria de longa duracao.",
    description:
      "Fone over-ear com bluetooth 5.3, microfone duplo e ate 40 horas de autonomia.",
    priceCents: 34990,
    compareAtPriceCents: 39990,
    stockQuantity: 40,
    categorySlugs: ["eletronicos"]
  },
  {
    slug: "cafeteira-smart-1l",
    sku: "CAS-CAFE-002",
    name: "Cafeteira Smart 1L",
    shortDescription: "Programacao automatica e jarra termica.",
    description:
      "Cafeteira eletrica com timer, filtro permanente e capacidade para 1 litro.",
    priceCents: 22990,
    compareAtPriceCents: 25990,
    stockQuantity: 25,
    categorySlugs: ["casa-e-cozinha"]
  },
  {
    slug: "camiseta-essential-algodao",
    sku: "MOD-CAMI-003",
    name: "Camiseta Essential Algodao",
    shortDescription: "Modelagem regular e toque macio.",
    description:
      "Camiseta unissex em algodao premium com acabamento reforcado para uso diario.",
    priceCents: 7990,
    compareAtPriceCents: 9990,
    stockQuantity: 120,
    categorySlugs: ["moda"]
  },
  {
    slug: "kit-organizador-dobravel",
    sku: "CAS-ORGA-004",
    name: "Kit Organizador Dobravel",
    shortDescription: "Conjunto com 4 caixas para armario e escritorio.",
    description:
      "Kit com estrutura leve e resistente, ideal para organizar roupas e acessorios.",
    priceCents: 12990,
    compareAtPriceCents: 14990,
    stockQuantity: 70,
    categorySlugs: ["casa-e-cozinha", "moda"]
  }
];

async function seedCategories() {
  const categoryMap = new Map();

  for (const category of categories) {
    const seededCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description
      },
      create: category
    });

    categoryMap.set(seededCategory.slug, seededCategory.id);
  }

  return categoryMap;
}

async function seedProducts(categoryMap) {
  for (const product of products) {
    const { categorySlugs, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: productData,
      create: {
        ...productData,
        categories: {
          create: categorySlugs.map((slug) => ({
            category: {
              connect: { slug }
            }
          }))
        }
      }
    });

    const seededProduct = await prisma.product.findUnique({
      where: { slug: product.slug },
      select: { id: true }
    });

    if (!seededProduct) {
      throw new Error(`Product not seeded: ${product.slug}`);
    }

    await prisma.productCategory.deleteMany({
      where: { productId: seededProduct.id }
    });

    await prisma.productCategory.createMany({
      data: categorySlugs.map((slug) => {
        const categoryId = categoryMap.get(slug);
        if (!categoryId) {
          throw new Error(`Category not found in seed map: ${slug}`);
        }

        return {
          productId: seededProduct.id,
          categoryId
        };
      }),
      skipDuplicates: true
    });
  }
}

async function main() {
  const categoryMap = await seedCategories();
  await seedProducts(categoryMap);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
