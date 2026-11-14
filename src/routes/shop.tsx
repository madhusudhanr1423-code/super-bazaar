import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { HeartButton } from '../lib/wishlist'
import { AddToCartButton } from '../components/AddToCartButton'

const PRICE_RANGES = [
  { label: 'All prices', value: 'all', min: 0, max: Infinity },
  { label: 'Under ₹500', value: 'under-500', min: 0, max: 500 },
  { label: '₹500 – ₹2,000', value: '500-2000', min: 500, max: 2000 },
  { label: 'Over ₹2,000', value: 'over-2000', min: 2000, max: Infinity },
]

type Product = {
  id: string
  name: string
  slug: string
  price: number
  mrp: number | null
  stock: number
  image_url: string | null
  rating: number | null
  review_count: number | null
  badge: string | null
  categories: { name: string } | null
}

type ShopData = {
  products: Product[]
  categories: string[]
}

export const Route = createFileRoute('/shop')({
    validateSearch: (
    s: Record<string, unknown>,
  ): { category?: string; q?: string } => ({
    category: typeof s.category === 'string' ? s.category : undefined,
    q: typeof s.q === 'string' ? s.q : undefined,
  }),
  loader: async (): Promise<ShopData> => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('name').order('name'),
    ])

    if (productsRes.error) throw productsRes.error
    if (categoriesRes.error) throw categoriesRes.error

    return {
      products: (productsRes.data ?? []) as unknown as Product[],
      categories: (categoriesRes.data ?? []).map((c) => c.name as string),
    }
  },
  component: ShopPage,
})


function ShopPage() {
  const { products} = Route.useLoaderData() as ShopData

  const { category: urlCategory, q: urlQuery } = Route.useSearch()
  const category = urlCategory ?? 'All'
  const search = urlQuery ?? ''

  
  const [sort, setSort] = useState('featured')
  const [priceRange, setPriceRange] = useState('all')
const [minRating, setMinRating] = useState(0)
const [inStockOnly, setInStockOnly] = useState(false)

const hasActiveFilters =
  priceRange !== 'all' || minRating > 0 || inStockOnly

const clearFilters = () => {
  setPriceRange('all')
  setMinRating(0)
  setInStockOnly(false)
}
  

  const filteredProducts = useMemo(() => {
    let result = products.filter((product: Product) => {
           const matchesCategory =
        category === 'All' ||
        (category === 'Deals'
          ? product.mrp !== null && product.mrp > product.price
          : product.categories?.name === category)

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const range = PRICE_RANGES.find((r) => r.value === priceRange)!
const matchesPrice = product.price >= range.min && product.price < range.max
const matchesRating = (product.rating ?? 0) >= minRating
const matchesStock = !inStockOnly || product.stock > 0

return (
  matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock
)
    })

    if (sort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    if (sort === 'rating') {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }

    return result
  }, [[products, search, category, sort, priceRange, minRating, inStockOnly]])

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      {/* Header */}
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            ← Back to Home
          </Link>

          <div className="mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
              Super Bazaar Marketplace
            </span>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
              {category === 'All' ? 'Shop All Products' : category}
            </h1>

            <p className="text-sm sm:text-base text-[#374151] mt-2 max-w-2xl">
              Discover everyday essentials, fresh groceries, fashion,
              home products, and electronics.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
<div className="flex flex-wrap items-center gap-3">
  <select
    value={priceRange}
    onChange={(e) => setPriceRange(e.target.value)}
    className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#16803C]"
  >
    {PRICE_RANGES.map((r) => (
      <option key={r.value} value={r.value}>{r.label}</option>
    ))}
  </select>

  <select
    value={minRating}
    onChange={(e) => setMinRating(Number(e.target.value))}
    className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#16803C]"
  >
    <option value={0}>Any rating</option>
    <option value={4}>4★ &amp; up</option>
    <option value={3}>3★ &amp; up</option>
  </select>

  <label className="flex items-center gap-2 text-sm font-semibold">
    <input
      type="checkbox"
      checked={inStockOnly}
      onChange={(e) => setInStockOnly(e.target.checked)}
      className="h-4 w-4 accent-[#16803C]"
    />
    In stock only
  </label>

  {hasActiveFilters && (
    <button
      type="button"
      onClick={clearFilters}
      className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
    >
      Clear filters
    </button>
  )}

  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#16803C] lg:ml-auto"
  >
    <option value="featured">Featured</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
    <option value="rating">Top Rated</option>
  </select>
</div>
          </div>
      </section>

      {/* Products */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
           <p className="text-sm text-[#374151]">
  Showing{' '}
  <span className="font-bold text-[#171717]">
    {filteredProducts.length}
  </span>{' '}
  {filteredProducts.length === 1 ? 'product' : 'products'}
</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: Product) => {
                const hasDiscount =
                  product.mrp !== null && product.mrp > product.price
                const discount = hasDiscount
                  ? Math.round(
                      (((product.mrp as number) - product.price) /
                        (product.mrp as number)) *
                        100,
                    )
                  : 0
                const outOfStock = product.stock <= 0

                return (
                  <article
                    key={product.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition hover:-translate-y-1 hover:shadow-lg"
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
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#374151]">
                          No image
                        </div>
                      )}

                        <div className="absolute right-3 top-3">
                          <HeartButton productId={product.id} />
                        </div>


                      {hasDiscount && (
                        <div className="absolute left-3 top-3">
                          <span className="rounded-full bg-[#16803C] px-2.5 py-1 text-[10px] font-bold text-white">
                            {discount}% OFF
                          </span>
                        </div>
                      )}

                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-bold text-[#374151]">
                            Out of stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                          {product.categories?.name ?? 'Uncategorized'}
                        </span>

                        <span className="text-xs font-semibold text-amber-500">
                          ★ {Number(product.rating ?? 0).toFixed(1)}
                        </span>
                      </div>

                     <h2 className="mt-2 line-clamp-2 text-base font-bold leading-snug">
                         <Link to="/product/$slug" params={{ slug: product.slug }}>
                             {product.name}
                          </Link>
                      </h2>

                      <p className="mt-1 mb-4 text-xs text-[#374151]">
                        {(product.review_count ?? 0).toLocaleString()} reviews
                      </p>

                      <div className="mt-auto flex items-end justify-between border-t border-[#E5E7EB] pt-4">
                        <div>
                          <div className="text-lg font-black">
                            ₹{product.price}
                          </div>

                          {hasDiscount && (
                            <div className="text-xs text-[#374151] line-through">
                              MRP ₹{product.mrp}
                            </div>
                          )}
                        </div>

                       <AddToCartButton product={product} disabled={outOfStock} />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] py-20 text-center">
  <h2 className="text-lg font-bold">No products found</h2>
  <p className="mt-2 text-sm text-[#374151]">
    Try changing or clearing your filters.
  </p>
  {hasActiveFilters && (
    <button
      type="button"
      onClick={clearFilters}
      className="mt-4 rounded-xl bg-[#16803C] px-4 py-2 text-sm font-bold text-white hover:bg-[#0F5C2E]"
    >
      Clear filters
    </button>
  )}
</div>
          )}
        </div>
      </section>
    </main>
  )
}