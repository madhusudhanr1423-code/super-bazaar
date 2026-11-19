import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/cart'

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: unknown) => void) => void
    }
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function CheckoutPage() {
  const { items, total, count, clear } = useCart()
  const navigate = useNavigate()

  const [payMethod, setPayMethod] = useState<'cod' | 'online'>('cod')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
  name?: string
  phone?: string
  address?: string
}>({})

 const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
      : 'border-[#E5E7EB] focus:border-[#16803C] focus:ring-[#16803C]/10'
  }`


  function validateForm() {
  const errs: { name?: string; phone?: string; address?: string } = {}

  if (name.trim().length < 2) {
    errs.name = 'Please enter your full name.'
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    errs.phone = 'Enter a valid 10-digit mobile number.'
  }

  if (address.trim().length < 15) {
    errs.address =
      'Please enter your full address (house no, street, city, pincode).'
  }

  setFieldErrors(errs)
  return Object.keys(errs).length === 0
}

  async function placeCodOrder() {
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

    await navigate({
      to: '/order-success/$orderId',
      params: { orderId: data as string },
    })
    clear()
  }

  async function placeOnlineOrder() {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setError('Could not load the payment gateway. Check your connection.')
      setSubmitting(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData.session?.access_token

    const cartItems = items.map((item) => ({ id: item.id, qty: item.qty }))

        // Step 1: ask our server to create a Razorpay order with the real total
    const createRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken ?? SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ items: cartItems }),
      },
    )
    const createData = await createRes.json()

    if (!createRes.ok) {
      setError(
        typeof createData.error === 'string'
          ? createData.error
          : JSON.stringify(createData.error) || 'Could not start payment.',
      )
      setSubmitting(false)
      return
    }

    // Step 2: open Razorpay's popup
    const razorpay = new window.Razorpay({
      key: createData.key_id,
      amount: createData.amount,
      currency: createData.currency,
      order_id: createData.razorpay_order_id,
      name: 'Super Bazaar',
      description: `${count} item${count === 1 ? '' : 's'}`,
      prefill: { name: name.trim(), contact: phone.trim() },
      theme: { color: '#16803C' },
      handler: async (response: unknown) => {
        const r = response as {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }

        // Step 3: verify the payment and place the order
        const verifyRes = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-razorpay-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken ?? SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              ...r,
              name: name.trim(),
              phone: phone.trim(),
              address: address.trim(),
              items: cartItems,
            }),
          },
        )
        const verifyData = await verifyRes.json()

        if (!verifyRes.ok) {
          setError(
            typeof verifyData.error === 'string'
              ? verifyData.error
              : JSON.stringify(verifyData.error) ||
                  'Payment could not be verified.',
          )
          setSubmitting(false)
          return
        }

        await navigate({
          to: '/order-success/$orderId',
          params: { orderId: verifyData.order_id as string },
        })
        clear()
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    })

    razorpay.open()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setSubmitting(true)

    if (payMethod === 'cod') {
      await placeCodOrder()
    } else {
      await placeOnlineOrder()
    }
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Your cart is empty</h1>
          <p className="mt-2 text-sm text-[#374151]">
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
  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
    Full name
  </label>
  <input
    type="text"
    value={name}
    onChange={(e) => {
      setName(e.target.value)
      setFieldErrors((prev) => ({ ...prev, name: undefined }))
    }}
    className={inputClass(!!fieldErrors.name)}
    placeholder="Your name"
    aria-invalid={!!fieldErrors.name}
  />
  {fieldErrors.name && (
    <p className="mt-1.5 text-xs font-medium text-red-600">
      {fieldErrors.name}
    </p>
  )}
</div>

<div>
  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
    Phone
  </label>
  <input
    type="tel"
    inputMode="numeric"
    maxLength={10}
    value={phone}
    onChange={(e) => {
      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
      setFieldErrors((prev) => ({ ...prev, phone: undefined }))
    }}
    className={inputClass(!!fieldErrors.phone)}
    placeholder="10-digit mobile number"
    aria-invalid={!!fieldErrors.phone}
  />
  {fieldErrors.phone && (
    <p className="mt-1.5 text-xs font-medium text-red-600">
      {fieldErrors.phone}
    </p>
  )}
</div>

<div>
  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
    Delivery address
  </label>
  <textarea
    value={address}
    onChange={(e) => {
      setAddress(e.target.value)
      setFieldErrors((prev) => ({ ...prev, address: undefined }))
    }}
    rows={4}
    className={inputClass(!!fieldErrors.address)}
    placeholder="House no, street, city, pincode"
    aria-invalid={!!fieldErrors.address}
  />
  {fieldErrors.address && (
    <p className="mt-1.5 text-xs font-medium text-red-600">
      {fieldErrors.address}
    </p>
  )}
</div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#374151]">
                Payment method
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('cod')}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    payMethod === 'cod'
                      ? 'border-[#16803C] bg-[#EAF7EF] text-[#16803C]'
                      : 'border-[#E5E7EB] text-[#171717] hover:border-[#16803C]'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('online')}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    payMethod === 'online'
                      ? 'border-[#16803C] bg-[#EAF7EF] text-[#16803C]'
                      : 'border-[#E5E7EB] text-[#171717] hover:border-[#16803C]'
                  }`}
                >
                  Pay Online
                </button>
              </div>
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
              {submitting
                ? 'Please wait...'
                : payMethod === 'cod'
                  ? `Place Order · ₹${total}`
                  : `Pay ₹${total}`}
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
                  <span className="line-clamp-2 text-[#374151]">
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