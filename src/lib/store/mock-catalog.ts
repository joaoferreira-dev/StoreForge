import type { ProductDetails, ProductListItem, ProductSort, StoreCategory } from "@/lib/store/catalog";

const categories: StoreCategory[] = [
  {
    id: "mock-eletronicos",
    slug: "eletronicos",
    name: "Eletronicos",
    description: "Dispositivos para produtividade e entretenimento."
  },
  {
    id: "mock-casa-e-cozinha",
    slug: "casa-e-cozinha",
    name: "Casa e Cozinha",
    description: "Itens essenciais para rotina da casa."
  },
  {
    id: "mock-moda",
    slug: "moda",
    name: "Moda",
    description: "Pecas versateis para uso diario."
  }
];

const productList: ProductListItem[] = [
  {
    id: "mock-fone",
    slug: "fone-bluetooth-pro",
    name: "Fone Bluetooth Pro",
    shortDescription: "Cancelamento de ruido e bateria de longa duracao.",
    priceCents: 34990,
    compareAtPriceCents: 39990,
    stockQuantity: 40,
    categorySlugs: ["eletronicos"],
    categoryNames: ["Eletronicos"]
  },
  {
    id: "mock-cafeteira",
    slug: "cafeteira-smart-1l",
    name: "Cafeteira Smart 1L",
    shortDescription: "Programacao automatica e jarra termica.",
    priceCents: 22990,
    compareAtPriceCents: 25990,
    stockQuantity: 25,
    categorySlugs: ["casa-e-cozinha"],
    categoryNames: ["Casa e Cozinha"]
  },
  {
    id: "mock-camiseta",
    slug: "camiseta-essential-algodao",
    name: "Camiseta Essential Algodao",
    shortDescription: "Modelagem regular e toque macio.",
    priceCents: 7990,
    compareAtPriceCents: 9990,
    stockQuantity: 120,
    categorySlugs: ["moda"],
    categoryNames: ["Moda"]
  },
  {
    id: "mock-organizador",
    slug: "kit-organizador-dobravel",
    name: "Kit Organizador Dobravel",
    shortDescription: "Conjunto com 4 caixas para armario e escritorio.",
    priceCents: 12990,
    compareAtPriceCents: 14990,
    stockQuantity: 70,
    categorySlugs: ["casa-e-cozinha", "moda"],
    categoryNames: ["Casa e Cozinha", "Moda"]
  }
];

const productDetailsMap: Record<string, ProductDetails> = {
  "fone-bluetooth-pro": {
    ...productList[0],
    sku: "ELE-FONE-001",
    description: "Fone over-ear com bluetooth 5.3, microfone duplo e ate 40 horas de autonomia."
  },
  "cafeteira-smart-1l": {
    ...productList[1],
    sku: "CAS-CAFE-002",
    description: "Cafeteira eletrica com timer, filtro permanente e capacidade para 1 litro."
  },
  "camiseta-essential-algodao": {
    ...productList[2],
    sku: "MOD-CAMI-003",
    description: "Camiseta unissex em algodao premium com acabamento reforcado para uso diario."
  },
  "kit-organizador-dobravel": {
    ...productList[3],
    sku: "CAS-ORGA-004",
    description: "Kit com estrutura leve e resistente, ideal para organizar roupas e acessorios."
  }
};

function applySort(items: ProductListItem[], sort: ProductSort | undefined): ProductListItem[] {
  if (sort === "price_asc") {
    return [...items].sort((a, b) => a.priceCents - b.priceCents);
  }

  if (sort === "price_desc") {
    return [...items].sort((a, b) => b.priceCents - a.priceCents);
  }

  return [...items];
}

export function getMockCategories(): StoreCategory[] {
  return [...categories];
}

export function getMockFeaturedProducts(limit: number): ProductListItem[] {
  return productList.slice(0, limit);
}

export function getMockProductList(filters: {
  query?: string;
  categorySlug?: string;
  sort?: ProductSort;
}): ProductListItem[] {
  const query = filters.query?.trim().toLowerCase();

  const filtered = productList.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query);

    const matchesCategory = !filters.categorySlug || product.categorySlugs.includes(filters.categorySlug);

    return matchesQuery && matchesCategory;
  });

  return applySort(filtered, filters.sort);
}

export function getMockProductBySlug(slug: string): ProductDetails | null {
  return productDetailsMap[slug] ?? null;
}
