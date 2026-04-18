import Link from "next/link";
import { updateOrderStatusAction } from "@/app/actions/admin";
import { requireAdminPageAccess } from "@/lib/auth/admin-guard";
import { ORDER_STATUS_OPTIONS, getBackofficeSnapshot } from "@/lib/admin/backoffice";
import { formatCurrency } from "@/lib/store/currency";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminPageAccess();
  const snapshot = await getBackofficeSnapshot();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Fase 5</p>
        <h1 className="text-2xl font-semibold text-gray-900">Operação do e-commerce</h1>
        <p className="mt-2 text-sm text-gray-600">Backoffice para catálogo e acompanhamento de pedidos.</p>
      </header>

      {!snapshot.databaseConfigured ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-700">
          <h2 className="text-lg font-semibold text-gray-900">Backoffice indisponível</h2>
          <p className="mt-2 text-sm">
            Configure <code>DATABASE_URL</code> para habilitar as operações administrativas.
          </p>
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Categorias</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{snapshot.categories.length}</p>
              <Link href="/admin/categorias" className="mt-4 inline-block text-sm font-medium text-gray-700 hover:text-gray-900">
                Gerenciar categorias
              </Link>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Produtos</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{snapshot.products.length}</p>
              <Link href="/admin/produtos" className="mt-4 inline-block text-sm font-medium text-gray-700 hover:text-gray-900">
                Gerenciar produtos
              </Link>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pedidos</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{snapshot.orders.length}</p>
              <Link href="/admin" className="mt-4 inline-block text-sm font-medium text-gray-700 hover:text-gray-900">
                Atualizar status
              </Link>
            </article>
          </section>

          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pedidos recentes</h2>
              <Link href="/checkout" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Ver fluxo de checkout
              </Link>
            </div>

            {snapshot.orders.length === 0 ? (
              <p className="rounded-md border border-dashed border-gray-300 p-6 text-sm text-gray-600">
                Nenhum pedido encontrado.
              </p>
            ) : (
              <div className="space-y-4">
                {snapshot.orders.map((order) => (
                  <article key={order.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Pedido</p>
                        <h3 className="text-base font-semibold text-gray-900">{order.orderNumber}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-base font-semibold text-gray-900">{formatCurrency(order.totalCents)}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-gray-700 md:grid-cols-4">
                      <p>
                        <span className="font-medium">Pagamento:</span> {order.paymentMethod === "CARD" ? "Cartão" : "PIX"}
                      </p>
                      <p>
                        <span className="font-medium">Itens:</span> {order.itemsCount}
                      </p>
                      <p>
                        <span className="font-medium">Cliente:</span> {order.guestEmail ?? "Convidado"}
                      </p>
                      <p>
                        <span className="font-medium">Data:</span>{" "}
                        {new Intl.DateTimeFormat("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short"
                        }).format(order.placedAt)}
                      </p>
                    </div>

                    <form action={updateOrderStatusAction} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input type="hidden" name="orderId" value={order.id} />
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-gray-900 focus:ring-2"
                      >
                        {ORDER_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                        Atualizar status
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
