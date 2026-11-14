import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/cart'
import { HeartButton } from '../lib/wishlist'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  mrp: number | null
  stock: number
  image_url: string | null
  rating: number | null
  review_count: number | null
  badge: string | null
  categories: { name: string } | null
}

export const Route = createFileRoute('/product/$slug')({
  loader: async ({ params }): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('slug', params.slug)
      .maybeSingle()

    if (error) throw error
    return data as unknown as Product | null
  },
  component: ProductPage,
})

function ProductPage() {
  const product = Route.useLoaderData() as Product | null
  const { addItem } = useCart()

  if (!product) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-black">Product not found</h1>
          <Link
            to="/shop"
            className="mt-4 inline-block text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            ← Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  const hasDiscount = product.mrp !== null && product.mrp > product.price
  const discount = hasDiscount
    ? Math.round(
        (((product.mrp as number) - product.price) / (product.mrp as number)) *
          100,
      )
    : 0
  const outOfStock = product.stock <= 0

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/shop"
          className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
        >
          ← Back to Shop
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gray-50">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#374151]">
                No image
              </div>
            )}

               <div className="absolute right-4 top-4">
                  <HeartButton productId={product.id} />
               </div>

            {hasDiscount && (
              <span className="absolute left-4 top-4 rounded-full bg-[#16803C] px-3 py-1 text-xs font-bold text-white">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
              {product.categories?.name ?? 'Uncategorized'}
            </span>

            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="font-semibold text-amber-500">
                ★ {Number(product.rating ?? 0).toFixed(1)}
              </span>
              <span className="text-[#374151]">
                {(product.review_count ?? 0).toLocaleString()} reviews
              </span>
              {product.badge && (
                <span className="rounded-full border border-[#E5E7EB] px-2.5 py-1 text-xs font-bold text-[#374151]">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="mt-6 flex items-end gap-3 border-t border-[#E5E7EB] pt-6">
              <div className="text-3xl font-black">₹{product.price}</div>
              {hasDiscount && (
                <div className="pb-1 text-sm text-[#374151] line-through">
                  MRP ₹{product.mrp}
                </div>
              )}
            </div>

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#374151]">
              {product.description ?? 'No description available yet.'}
            </p>

            <p
              className={`mt-6 text-sm font-semibold ${
                outOfStock ? 'text-red-600' : 'text-[#16803C]'
              }`}
            >
              {outOfStock ? 'Out of stock' : `In stock (${product.stock} left)`}
            </p>

            <button
              type="button"
              disabled={outOfStock}
              onClick={() => addItem(product)}
              className="mt-6 w-full rounded-xl bg-[#16803C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E] disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#374151] sm:w-auto"
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}