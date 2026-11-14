import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/cart'



// =============================================================================
// PLACEHOLDER DATA
// =============================================================================

const CATEGORIES = [
  {
    id: 'groceries',
    name: 'Groceries',
    tagline: 'Farm-fresh & daily essentials',
    itemCount: '1,400+ Products',
    bgColor: 'bg-gray-50',
    borderColor: 'border-[#E5E7EB]',
    accentColor: 'text-[#16803C]',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    tagline: 'Trendy apparel & accessories',
    itemCount: '2,800+ Products',
    bgColor: 'bg-gray-50',
    borderColor: 'border-[#E5E7EB]',
    accentColor: 'text-amber-800',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    tagline: 'Cookware, appliances & decor',
    itemCount: '950+ Products',
    bgColor: 'bg-gray-50',
    borderColor: 'border-[#E5E7EB]',
    accentColor: 'text-blue-800',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    tagline: 'Audio, gadgets & tech essentials',
    itemCount: '620+ Products',
    bgColor: 'bg-gray-50',
    borderColor: 'border-[#E5E7EB]',
    accentColor: 'text-purple-800',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
  },
]

type Product = {
  id: string
  name: string
  slug: string
  price: number
  mrp: number | null
  image_url: string | null
  rating: number | null
  review_count: number | null
  badge: string | null
  categories: { name: string } | null
}

type HomeData = { products: Product[] }

const countLabel = (n: number) => `${n} ${n === 1 ? 'Product' : 'Products'}`

const toCard = (p: Product) => {
  const hasDiscount = p.mrp !== null && p.mrp > p.price
  return {
    id: p.id,
    name: p.name,
    brand: p.categories?.name ?? '',
    specification: '',
    unit: '',
    price: p.price,
    mrp: p.mrp ?? p.price,
    discount: hasDiscount
      ? `${Math.round(((p.mrp! - p.price) / p.mrp!) * 100)}% OFF`
      : '',
    rating: Number(p.rating ?? 0).toFixed(1),
    reviews: p.review_count ?? 0,
    badge: p.badge ?? '',
    image: p.image_url ?? '',
  }
}

// =============================================================================
// HOMEPAGE COMPONENT
// =============================================================================

export const Route = createFileRoute('/')({
  loader: async (): Promise<HomeData> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return { products: (data ?? []) as unknown as Product[] }
  },
  component: HomePage,
})

function HomePage() {
  const { products } = Route.useLoaderData() as HomeData
  const { addItem } = useCart()
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const TOP_DEALS = products
    .filter((p) => p.mrp !== null && p.mrp > p.price)
    .slice(0, 4)
    .map(toCard)
  const FRESH_GROCERIES = products
    .filter((p) => p.categories?.name === 'Groceries')
    .slice(0, 4)
    .map(toCard)
  const TRENDING_FASHION = products
    .filter((p) => p.categories?.name === 'Fashion')
    .slice(0, 4)
    .map(toCard)

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) addItem(product)
    setAddedItems((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }))
    }, 1500)
  }

  return (
    
    <div className="min-h-screen bg-white text-[#171717]">
      
      {/* ======================================================================= */}
      {/* 1. HERO SECTION                                                        */}
      {/* ======================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50/70 via-white to-white border-b border-[#E5E7EB]">
        {/* Subtle background decoration */}
        <div
          className="absolute top-0 right-1/4 -z-10 w-96 h-96 rounded-full bg-[#EAF7EF] blur-3xl opacity-70 pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7EF] border border-[#16803C]/20 text-[#16803C] text-xs font-bold uppercase tracking-wider">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Express 30-Min Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#171717] leading-[1.12]">
                Your Everyday Marketplace, Delivered{' '}
                <span className="text-[#16803C]">Fresh & Fast.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Shop farm-fresh organic produce, contemporary fashion trends,
                home essentials, and high-performance electronics at genuine
                everyday value.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#16803C] hover:bg-[#0F5C2E] text-white font-semibold text-base shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
                >
                  <span>Shop Now</span>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>

                <a
                  href="#categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-gray-50 text-[#171717] font-semibold text-base border border-[#E5E7EB] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
                >
                  <span>Explore Categories</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E5E7EB]/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-[#171717]">COD</div>
                  <div className="text-xs text-[#6B7280]">Cash on Delivery</div>
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-[#16803C]">Razorpay</div>
                  <div className="text-xs text-[#6B7280]">Secure Payments</div>
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-[#171717]">7 Days</div>
                  <div className="text-xs text-[#6B7280]">Easy Returns</div>
                </div>
              </div>
            </div>

            {/* Right Visual Area */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Visual Showcase Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB] bg-white group">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                    alt="Fresh marketplace groceries and organic produce"
                    className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="inline-block self-start px-3 py-1 rounded-full bg-[#16803C] text-xs font-bold uppercase tracking-wider mb-2">
                      Farm to Kitchen
                    </span>
                    <h3 className="text-xl font-bold">100% Organic & Sourced Daily</h3>
                    <p className="text-xs text-gray-200 mt-1">
                      Direct from local growers, handpicked every morning.
                    </p>
                  </div>
                </div>

                {/* Floating Highlight Card 1 */}
                <div className="absolute -bottom-16 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-[#E5E7EB] flex items-center gap-3.5 hidden sm:flex">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] text-[#16803C] flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#171717]">Quality Verified</div>
                    <div className="text-xs text-[#6B7280]">Guaranteed 100% genuine</div>
                  </div>
                </div>

                {/* Floating Highlight Card 2 */}
                <div className="absolute -top-4 -right-4 bg-white py-2.5 px-4 rounded-2xl shadow-md border border-[#E5E7EB] flex items-center gap-2 hidden sm:flex">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#16803C]" />
                  <span className="text-xs font-semibold text-[#171717]">Secure checkout by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 2. SHOP BY CATEGORY                                                    */}
      {/* ======================================================================= */}
      <section id="categories" className="py-16 md:py-20 border-b border-[#E5E7EB] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16803C] uppercase tracking-wider">
                Explore Marketplace
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight mt-1">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E] transition-colors"
            >
              <span>View All Categories</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to="/shop"
                search={{ category: category.name }}
                className={`group rounded-2xl border ${category.borderColor} ${category.bgColor} p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#16803C]/40 hover:shadow-md flex flex-col justify-between`}
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5 border border-white/60 bg-white">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#16803C] transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 text-[#6B7280] border border-gray-200">
                      {countLabel(products.filter((p) => p.categories?.name === category.name).length)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1.5">
                    {category.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 3. TOP DEALS                                                           */}
      {/* ======================================================================= */}
      <section className="py-16 md:py-20 border-b border-[#E5E7EB] bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16803C] uppercase tracking-wider">
                <svg
                  className="w-4 h-4 text-[#16803C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                <span>Don't Miss Out</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight mt-1">
                Top Deals of the Day
              </h2>
            </div>
            <Link
              to="/shop"
              search={{ category: 'Deals' }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E] transition-colors"
            >
              <span>See All Deals</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOP_DEALS.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-[#E5E7EB]/60">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="bg-[#16803C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {deal.discount}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <span className="text-amber-500 font-bold">★ {deal.rating}</span>
                      <span>({deal.reviews})</span>
                    </div>

                    <h3 className="font-bold text-[#171717] text-base mt-1.5 leading-snug line-clamp-2">
                      {deal.name}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {deal.specification}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-[#171717]">
                        ₹{deal.price}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[#6B7280] line-through">
                          MRP ₹{deal.mrp}
                        </span>
                        <span className="text-[11px] font-semibold text-[#16803C]">
                          Save ₹{deal.mrp - deal.price}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(deal.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                        addedItems[deal.id]
                          ? 'bg-[#EAF7EF] text-[#16803C] border border-[#16803C]'
                          : 'bg-[#16803C] hover:bg-[#0F5C2E] text-white'
                      }`}
                    >
                      {addedItems[deal.id] ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" x2="12" y1="5" y2="19" />
                            <line x1="5" x2="19" y1="12" y2="12" />
                          </svg>
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 4. FRESH GROCERIES                                                     */}
      {/* ======================================================================= */}
      <section className="py-16 md:py-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16803C] uppercase tracking-wider">
                Farm To Kitchen
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight mt-1">
                Fresh Groceries & Essentials
              </h2>
            </div>
            <Link
              to="/shop"
              search={{ category: 'Groceries' }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E] transition-colors"
            >
              <span>Browse All Groceries</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRESH_GROCERIES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative aspect-square overflow-hidden bg-emerald-50/40 border-b border-[#E5E7EB]/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-[#6B7280]">{item.unit}</div>
                    <h3 className="font-bold text-[#171717] text-base mt-1 leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-1.5">
                      <span className="text-amber-500 font-bold">★ {item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-[#171717]">
                        ₹{item.price}
                      </div>
                      <span className="text-xs text-[#6B7280] line-through">
                        MRP ₹{item.mrp}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                        addedItems[item.id]
                          ? 'bg-[#EAF7EF] text-[#16803C] border border-[#16803C]'
                          : 'bg-[#16803C] hover:bg-[#0F5C2E] text-white'
                      }`}
                    >
                      {addedItems[item.id] ? 'Added ✓' : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 5. TRENDING FASHION                                                    */}
      {/* ======================================================================= */}
      <section className="py-16 md:py-20 border-b border-[#E5E7EB] bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16803C] uppercase tracking-wider">
                Wardrobe Staples
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight mt-1">
                Trending Fashion
              </h2>
            </div>
            <Link
              to="/shop"
              search={{ category: 'Fashion' }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E] transition-colors"
            >
              <span>Explore Collection</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRENDING_FASHION.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 border-b border-[#E5E7EB]/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-[#171717] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs border border-gray-100">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {item.brand}
                    </span>
                    <h3 className="font-bold text-[#171717] text-base mt-0.5 leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-1.5">
                      <span className="text-amber-500 font-bold">★ {item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-[#171717]">
                        ₹{item.price}
                      </div>
                      <span className="text-xs text-[#6B7280] line-through">
                        MRP ₹{item.mrp}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                        addedItems[item.id]
                          ? 'bg-[#EAF7EF] text-[#16803C] border border-[#16803C]'
                          : 'bg-[#16803C] hover:bg-[#0F5C2E] text-white'
                      }`}
                    >
                      {addedItems[item.id] ? 'Added ✓' : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================= */}
      {/* 6. WHY SHOP WITH SUPER BAZAAR                                          */}
      {/* ======================================================================= */}
      <section className="py-16 md:py-20 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#16803C] uppercase tracking-wider">
              The Super Bazaar Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight mt-1">
              Why Shop With Super Bazaar
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              Everyday convenience backed by quality sourcing, fast fulfillment,
              and frictionless customer care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/40 p-6 flex flex-col items-start hover:border-[#16803C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] flex items-center justify-center text-[#16803C] mb-4">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#171717]">Fast Delivery</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Enjoy delivery in as fast as 30 minutes, or pick scheduled
                doorstep time-slots that fit your routine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/40 p-6 flex flex-col items-start hover:border-[#16803C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] flex items-center justify-center text-[#16803C] mb-4">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#171717]">Secure Payments</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Bank-grade 256-bit encryption for seamless UPI, credit/debit cards,
                net banking, and cash on delivery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/40 p-6 flex flex-col items-start hover:border-[#16803C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] flex items-center justify-center text-[#16803C] mb-4">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 4-4 4 4" />
                  <path d="M7 5v10a4 4 0 0 0 4 4h10" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#171717]">Easy Returns</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Hassle-free 7-day doorstep replacement and instant refunds
                without complicated procedures.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/40 p-6 flex flex-col items-start hover:border-[#16803C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] flex items-center justify-center text-[#16803C] mb-4">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#171717]">Quality Products</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Directly procured from verified farmers, producers, and official
                brand partners with rigorous checks.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}