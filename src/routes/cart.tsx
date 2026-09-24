import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '../lib/cart'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { items, total, count, setQty, removeItem, clear } = useCart()

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

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">
            Your Cart
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] py-20 text-center">
              <h2 className="text-lg font-bold">Your cart is empty</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Add some products to get started.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#6B7280]">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          to="/product/$slug"
                          params={{ slug: item.slug }}
                          className="line-clamp-2 text-sm font-bold leading-snug hover:text-[#16803C]"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-semibold text-[#6B7280] hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-[#E5E7EB]">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="px-3 py-1.5 text-sm font-bold hover:text-[#16803C]"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="px-3 py-1.5 text-sm font-bold hover:text-[#16803C]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-base font-black">
                          ₹{item.price * item.qty}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Summary */}
              <aside className="h-fit rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-black">Order Summary</h2>

                <div className="mt-4 flex items-center justify-between text-sm text-[#6B7280]">
                  <span>Subtotal ({count} items)</span>
                  <span className="font-semibold text-[#171717]">₹{total}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm text-[#6B7280]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#16803C]">Free</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-black">₹{total}</span>
                </div>

                <button>
                  <Link to="/checkout"
                      className="mt-6 block w-full rounded-xl bg-[#16803C] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0F5C2E]">
                     Proceed to Checkout
                  </Link>
                </button>

                <button
                  type="button"
                  onClick={clear}
                  className="mt-3 w-full text-xs font-semibold text-[#6B7280] hover:text-red-600"
                >
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}