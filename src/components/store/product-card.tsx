import Link from "next/link";
import { addToCartAction } from "@/app/actions/cart";
import { formatCurrency } from "@/lib/store/currency";

type ProductCardProps = {
  productId: string;
  slug: string;
  name: string;
  shortDescription: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  categoryNames: string[];
  redirectTo?: string;
};

export function ProductCard({
  productId,
  slug,
  name,
  shortDescription,
  priceCents,
  compareAtPriceCents,
  categoryNames,
  redirectTo
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 rounded-lg bg-gray-100 p-8 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
        Imagem do produto
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {categoryNames.map((categoryName) => (
          <span key={categoryName} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
            {categoryName}
          </span>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        <Link href={`/produto/${slug}`} className="hover:underline">
          {name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">{shortDescription}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900">{formatCurrency(priceCents)}</span>
        {compareAtPriceCents ? (
          <span className="text-sm text-gray-500 line-through">{formatCurrency(compareAtPriceCents)}</span>
        ) : null}
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          href={`/produto/${slug}`}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          Ver produto
        </Link>
        <form action={addToCartAction} className="flex-1">
          <input type="hidden" name="productId" value={productId} />
          {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Adicionar
          </button>
        </form>
      </div>
    </article>
  );
}
