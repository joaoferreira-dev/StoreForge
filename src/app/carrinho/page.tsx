import Link from "next/link";
import { removeCartItemAction, updateCartItemQuantityAction } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/store/currency";
import { getCartForCurrentSession } from "@/lib/store/cart";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCartForCurrentSession();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Carrinho</h1>
        <p className="mt-1 text-sm text-gray-600">Revise os itens antes de seguir para o checkout.</p>
      </header>

      {!cart || cart.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600">Seu carrinho está vazio.</p>
          <Link href="/produtos" className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.8fr_1fr]">
          <section className="space-y-3">
            {cart.items.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-900">{item.productName}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatCurrency(item.unitPriceCents)} por unidade
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(item.totalCents)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={updateCartItemQuantityAction}>
                      <input type="hidden" name="cartItemId" value={item.id} />
                      <input type="hidden" name="operation" value="decrement" />
                      <button type="submit" className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-800">
                        -
                      </button>
                    </form>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <form action={updateCartItemQuantityAction}>
                      <input type="hidden" name="cartItemId" value={item.id} />
                      <input type="hidden" name="operation" value="increment" />
                      <button type="submit" className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-800">
                        +
                      </button>
                    </form>
                    <form action={removeCartItemAction}>
                      <input type="hidden" name="cartItemId" value={item.id} />
                      <button type="submit" className="ml-2 text-sm text-red-600 hover:text-red-700">
                        Remover
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Resumo</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Itens</span>
                <span>{cart.totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(cart.subtotalCents)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 block rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-black"
            >
              Ir para checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
