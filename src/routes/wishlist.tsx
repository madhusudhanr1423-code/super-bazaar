import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { useCart } from '../lib/cart'
import { HeartButton, useWishlist } from '../lib/wishlist'

export const Route = createFileRoute('/wishlist')({
  component: WishlistPage,
})

type Product = {
  id: string
  name: string
  slug: string
  price: number
  mrp: number | null
  stock: number
  image_url: string | null
  categories: { name: string } | null
}

type Row = { product_id: string; products: Product | null }

function WishlistPage() {
  const { user, loading } = useAuth()
  const { has } = useWishlist()
  const { addItem } = useCart()

  const [rows, setRows] = useState<Row[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return

    if (!user) {
      setFetching(false)
      return
    }

    supabase
      .from('wishlist')
      .select('product_id, products(*, categories(name))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        else setRows((data ?? []) as unknown as Row[])
        setFetching(false)
      })
  }, [user, loading])

  if (loading || fetching) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <p className="py-20 text-center text-sm text-[#6B7280]">Loading...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Sign in to see your wishlist</h1>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
          >
            Sign In
          </Link>
        </div>
      </main>
    )
  }

  // Hide items the user has just un-hearted on this page
  const visible = rows.filter((row) => row.products && has(row.product_id))

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            ← Continue Shopping
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">
            Your Wishlist
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            {visible.length} {visible.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] py-20 text-center">
              <h2 className="text-lg font-bold">Your wishlist is empty</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Tap the heart on any product to save it here.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visible.map((row) => {
                const product = row.products as Product
                const outOfStock = product.stock <= 0

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#6B7280]">
                          No image
                        </div>
                      )}

                      <div className="absolute right-3 top-3">
                        <HeartButton productId={product.id} />
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                        {product.categories?.name ?? 'Uncategorized'}
                      </span>

                      <h2 className="mt-2 line-clamp-2 text-base font-bold leading-snug">
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.slug }}
                        >
                          {product.name}
                        </Link>
                      </h2>

                      <div className="mt-5 flex items-end justify-between border-t border-[#E5E7EB] pt-4">
                        <div>
                          <div className="text-lg font-black">
                            ₹{product.price}
                          </div>
                          {product.mrp !== null && product.mrp > product.price && (
                            <div className="text-xs text-[#6B7280] line-through">
                              MRP ₹{product.mrp}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => addItem(product)}
                          disabled={outOfStock}
                          className="rounded-xl bg-[#16803C] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F5C2E] disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#6B7280]"
                        >
                          {outOfStock ? 'Sold out' : '+ Add'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}