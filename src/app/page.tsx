import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { appConfig } from "@/lib/config/env";
import { getFeaturedProducts, getStoreCategories } from "@/lib/store/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([getStoreCategories(), getFeaturedProducts(4)]);
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Fase 3 em implementação</p>
        <h1 className="text-3xl font-bold">{appConfig.appName}: vitrine dinâmica para o MVP</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Busque produtos, navegue por categoria e monte seu carrinho com checkout em múltiplas etapas.
        </p>
        <form action="/produtos" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            placeholder="Buscar no catálogo"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-gray-900 focus:ring-2"
          />
          <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
            Buscar
          </button>
        </form>
      </header>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categorias</h2>
          <Link href="/produtos" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Ver todas
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/produtos?categoria=${category.slug}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:border-gray-400"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Destaques</h2>
          <Link href="/produtos" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Ir para listagem
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
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
      </section>
    </main>
  );
}
