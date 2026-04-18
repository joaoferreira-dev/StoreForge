import Link from "next/link";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/app/actions/admin";
import { requireAdminPageAccess } from "@/lib/auth/admin-guard";
import { getBackofficeSnapshot } from "@/lib/admin/backoffice";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdminPageAccess();
  const snapshot = await getBackofficeSnapshot();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Backoffice</p>
          <h1 className="text-2xl font-semibold text-gray-900">CRUD de categorias</h1>
        </div>
        <Link href="/admin" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Voltar ao painel
        </Link>
      </header>

      {!snapshot.databaseConfigured ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-700">
          Configure <code>DATABASE_URL</code> para gerenciar categorias.
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Nova categoria</h2>
            <form action={createCategoryAction} className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Nome
                <input required name="name" type="text" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Slug
                <input
                  required
                  name="slug"
                  type="text"
                  placeholder="ex: casa-e-cozinha"
                  className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-3">
                Descrição
                <input name="description" type="text" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
              </label>
              <div className="md:col-span-3">
                <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                  Criar categoria
                </button>
              </div>
            </form>
          </section>

          <section className="mt-6 space-y-4">
            {snapshot.categories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-600">
                Nenhuma categoria cadastrada.
              </div>
            ) : (
              snapshot.categories.map((category) => (
                <article key={category.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                    <span className="text-sm text-gray-500">{category.productsCount} produto(s)</span>
                  </div>

                  <form action={updateCategoryAction} className="grid gap-3 md:grid-cols-3">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Nome
                      <input
                        required
                        name="name"
                        type="text"
                        defaultValue={category.name}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Slug
                      <input
                        required
                        name="slug"
                        type="text"
                        defaultValue={category.slug}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-3">
                      Descrição
                      <input
                        name="description"
                        type="text"
                        defaultValue={category.description ?? ""}
                        className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                      />
                    </label>
                    <div className="md:col-span-3 flex flex-wrap gap-2">
                      <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                        Salvar alterações
                      </button>
                    </div>
                  </form>

                  <form action={deleteCategoryAction} className="mt-3">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <button type="submit" className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                      Excluir categoria
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
