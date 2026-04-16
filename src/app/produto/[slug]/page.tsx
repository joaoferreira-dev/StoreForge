import { notFound } from "next/navigation";
import { addToCartAction } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/store/currency";
import { getProductBySlug } from "@/lib/store/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="rounded-xl bg-gray-100 p-14 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
          Galeria do produto
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {product.categoryNames.map((categoryName) => (
              <span key={categoryName} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {categoryName}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-sm text-gray-600">{product.shortDescription}</p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.priceCents)}</span>
            {product.compareAtPriceCents ? (
              <span className="text-sm text-gray-500 line-through">{formatCurrency(product.compareAtPriceCents)}</span>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-gray-700">{product.description}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-gray-500">SKU: {product.sku}</p>

          <form action={addToCartAction} className="mt-6">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="redirectTo" value="/carrinho" />
            <button type="submit" className="rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black">
              Adicionar ao carrinho
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
