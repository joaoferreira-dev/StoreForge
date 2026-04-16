import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { getProductList, getStoreCategories, type ProductSort } from "@/lib/store/catalog";

type ProductListPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    ordem?: ProductSort;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProductListPage({ searchParams }: ProductListPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const categorySlug = params.categoria?.trim() ?? "";
  const sort = params.ordem ?? "newest";

  const [categories, products] = await Promise.all([
    getStoreCategories(),
    getProductList({
      query,
      categorySlug: categorySlug || undefined,
      sort
    })
  ]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Catálogo de produtos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Explore o catálogo com busca textual, filtro por categoria e ordenação por preço.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-4">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nome ou descrição"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-gray-900 focus:ring-2 md:col-span-2"
          />
          <select
            name="categoria"
            defaultValue={categorySlug}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-gray-900 focus:ring-2"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="ordem"
            defaultValue={sort}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-gray-900 focus:ring-2"
          >
            <option value="newest">Mais recentes</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
          <div className="md:col-span-4">
            <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
              Aplicar filtros
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">{products.length} produto(s) encontrado(s)</p>
          <Link href="/carrinho" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Ir para carrinho
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
            Nenhum produto encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                slug={product.slug}
                name={product.name}
                shortDescription={product.shortDescription}
                priceCents={product.priceCents}
                compareAtPriceCents={product.compareAtPriceCents}
                categoryNames={product.categoryNames}
                redirectTo="/carrinho"
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
