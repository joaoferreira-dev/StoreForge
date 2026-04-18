import Link from "next/link";
import { createProductAction, deleteProductAction, updateProductAction } from "@/app/actions/admin";
import { getBackofficeSnapshot } from "@/lib/admin/backoffice";
import { centsToInputValue } from "@/lib/admin/form-parsers";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const snapshot = await getBackofficeSnapshot();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Backoffice</p>
          <h1 className="text-2xl font-semibold text-gray-900">CRUD de produtos</h1>
        </div>
        <Link href="/admin" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Voltar ao painel
        </Link>
      </header>

      {!snapshot.databaseConfigured ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-700">
          Configure <code>DATABASE_URL</code> para gerenciar produtos.
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Novo produto</h2>
            <form action={createProductAction} className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Nome
                <input required name="name" type="text" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Slug
                <input required name="slug" type="text" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                SKU
                <input required name="sku" type="text" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Estoque
                <input required min={0} name="stockQuantity" type="number" defaultValue={0} className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Preço (BRL)
                <input required min={0} step="0.01" name="price" type="number" defaultValue="0.00" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Preço comparativo (BRL)
                <input min={0} step="0.01" name="compareAtPrice" type="number" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
                Descrição curta
                <input
                  required
                  name="shortDescription"
                  type="text"
                  className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
                Descrição completa
                <textarea
                  required
                  name="description"
                  rows={3}
                  className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                />
              </label>

              <fieldset className="rounded-md border border-gray-200 p-3 md:col-span-2">
                <legend className="px-1 text-sm font-medium text-gray-800">Categorias</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {snapshot.categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" name="categoryIds" value={category.id} className="h-4 w-4" />
                      {category.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-800 md:col-span-2">
                <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" />
                Produto ativo no catálogo
              </label>

              <div className="md:col-span-2">
                <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                  Criar produto
                </button>
              </div>
            </form>
          </section>

          <section className="mt-6 space-y-4">
            {snapshot.products.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-600">
                Nenhum produto cadastrado.
              </div>
            ) : (
              snapshot.products.map((product) => (
                <article key={product.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{product.isActive ? "Ativo" : "Inativo"}</span>
                  </div>

                  <form action={updateProductAction} className="grid gap-3 md:grid-cols-2">
                    <input type="hidden" name="productId" value={product.id} />
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Nome
                      <input
                        required
                        name="name"
                        type="text"
                        defaultValue={product.name}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Slug
                      <input
                        required
                        name="slug"
                        type="text"
                        defaultValue={product.slug}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      SKU
                      <input
                        required
                        name="sku"
                        type="text"
                        defaultValue={product.sku}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Estoque
                      <input
                        required
                        min={0}
                        name="stockQuantity"
                        type="number"
                        defaultValue={product.stockQuantity}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Preço (BRL)
                      <input
                        required
                        min={0}
                        step="0.01"
                        name="price"
                        type="number"
                        defaultValue={centsToInputValue(product.priceCents)}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Preço comparativo (BRL)
                      <input
                        min={0}
                        step="0.01"
                        name="compareAtPrice"
                        type="number"
                        defaultValue={product.compareAtPriceCents ? centsToInputValue(product.compareAtPriceCents) : ""}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
                      Descrição curta
                      <input
                        required
                        name="shortDescription"
                        type="text"
                        defaultValue={product.shortDescription}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
                      Descrição completa
                      <textarea
                        required
                        name="description"
                        rows={3}
                        defaultValue={product.description}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>

                    <fieldset className="rounded-md border border-gray-200 p-3 md:col-span-2">
                      <legend className="px-1 text-sm font-medium text-gray-800">Categorias</legend>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {snapshot.categories.map((category) => (
                          <label key={`${product.id}-${category.id}`} className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              name="categoryIds"
                              value={category.id}
                              defaultChecked={product.categories.some((productCategory) => productCategory.id === category.id)}
                              className="h-4 w-4"
                            />
                            {category.name}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="flex items-center gap-2 text-sm font-medium text-gray-800 md:col-span-2">
                      <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="h-4 w-4" />
                      Produto ativo no catálogo
                    </label>

                    <div className="md:col-span-2 flex flex-wrap gap-2">
                      <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                        Salvar alterações
                      </button>
                    </div>
                  </form>

                  <form action={deleteProductAction} className="mt-3">
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit" className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                      Excluir produto
                    </button>
                  </form>
                </article>
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}
