import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/cart'


export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { items, total, count, clear } = useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)

  const inputClass =
    'w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/10'

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setError('')

  if (!name.trim() || !phone.trim() || !address.trim()) {
    setError('Please fill in all fields.')
    return
  }

  setSubmitting(true)

  const { data, error: rpcError } = await supabase.rpc('place_order', {
    p_name: name.trim(),
    p_phone: phone.trim(),
    p_address: address.trim(),
    p_items: items.map((item) => ({ id: item.id, qty: item.qty })),
  })

  if (rpcError) {
    setError(rpcError.message)
    setSubmitting(false)
    return
  }

  clear()
  setOrderId(data as string)
  setSubmitting(false)
}

  // Success screen
  if (orderId) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7EF] text-2xl text-[#16803C]">
            ✓
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight">
            Order placed!
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Thank you, we&apos;ve received your order.
          </p>
          <p className="mt-4 text-xs text-[#6B7280]">
            Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Your cart is empty</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Add some products before checking out.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
          >
            Browse Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/cart"
            className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            ← Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-6">
            Checkout
          </h1>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:col-span-2"
          >
            <h2 className="text-lg font-black">Delivery Details</h2>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Delivery address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className={inputClass}
                placeholder="House no, street, city, pincode"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#16803C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Placing order...' : `Place Order · ₹${total}`}
            </button>
          </form>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-black">
              Order Summary ({count} {count === 1 ? 'item' : 'items'})
            </h2>

            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="line-clamp-2 text-[#6B7280]">
                    {item.name} × {item.qty}
                  </span>
                  <span className="font-semibold">₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
              <span className="text-base font-bold">Total</span>
              <span className="text-xl font-black">₹{total}</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}