import Link from "next/link";
import { completeCheckoutAction } from "@/app/actions/checkout";
import { formatCurrency } from "@/lib/store/currency";
import { getCartForCurrentSession } from "@/lib/store/cart";

type CheckoutPageProps = {
  searchParams: Promise<{
    success?: string;
    order?: string;
  }>;
};

const SHIPPING_CENTS = 1990;

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const cart = await getCartForCurrentSession();
  const isSuccess = params.success === "1" && typeof params.order === "string";

  if (isSuccess) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pedido criado</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Compra finalizada com sucesso</h1>
          <p className="mt-3 text-gray-600">
            Seu pedido <strong>{params.order}</strong> foi registrado e está com status inicial pendente de pagamento.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/produtos" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
              Continuar comprando
            </Link>
            <Link href="/" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
              Voltar para home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Checkout indisponível</h1>
          <p className="mt-2 text-gray-600">Adicione produtos ao carrinho para iniciar a finalização da compra.</p>
          <Link href="/produtos" className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Ir para produtos
          </Link>
        </div>
      </main>
    );
  }

  const totalCents = cart.subtotalCents + SHIPPING_CENTS;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-1 text-sm text-gray-600">Preencha os dados para concluir a compra como convidado.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.7fr_1fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <form action={completeCheckoutAction} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">Dados de contato</h2>
            </div>

            <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
              E-mail
              <input
                required
                type="email"
                name="guestEmail"
                className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
                placeholder="voce@exemplo.com"
              />
            </label>

            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">Endereço de entrega</h2>
            </div>

            <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
              Nome do destinatário
              <input required type="text" name="recipientName" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Rua
              <input required type="text" name="street" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Número
              <input required type="text" name="number" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
              Complemento
              <input type="text" name="complement" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Bairro
              <input required type="text" name="district" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Cidade
              <input required type="text" name="city" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Estado
              <input required type="text" name="state" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              CEP
              <input required type="text" name="postalCode" className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2" />
            </label>

            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">Pagamento</h2>
            </div>
            <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
              Método de pagamento
              <select
                name="paymentMethod"
                defaultValue="CARD"
                className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
              >
                <option value="CARD">Cartão de crédito</option>
                <option value="PIX">PIX</option>
              </select>
            </label>

            <div className="md:col-span-2">
              <button type="submit" className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black">
                Finalizar compra
              </button>
            </div>
          </form>
        </section>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Resumo do pedido</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span>
                  {item.productName} <span className="text-gray-500">x{item.quantity}</span>
                </span>
                <span>{formatCurrency(item.totalCents)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.subtotalCents)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Frete</span>
              <span>{formatCurrency(SHIPPING_CENTS)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(totalCents)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
