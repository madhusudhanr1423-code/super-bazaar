import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/order-success/$orderId')({
  component: OrderSuccessPage,
})

type OrderItem = { id: string; name: string; price: number; qty: number }

type Order = {
  id: string
  total: number
  address: string
  payment_status: string
  order_items: OrderItem[]
}

function OrderSuccessPage() {
  const { orderId } = Route.useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from('orders')
      .select('id, total, address, payment_status, order_items(*)')
      .eq('id', orderId)
      .maybeSingle()
      .then(({ data }) => {
        setOrder((data as unknown as Order) ?? null)
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <p className="py-20 text-center text-sm text-[#6B7280]">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7EF] text-2xl text-[#16803C]">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight">
          Order placed!
        </h1>
        <p className="mt-2 text-sm text-[#374151]">
          Thank you, we&apos;ve received your order. You can track it from My
          Orders.
        </p>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#374151]">
          Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(orderId.slice(0, 8))
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
            className="font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </p>

        {order && (
          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-5 text-left">
            <ul className="space-y-2 text-sm">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span className="text-[#374151]">
                    {item.name} × {item.qty}
                  </span>
                  <span className="font-semibold">
                    ₹{item.price * item.qty}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between border-t border-[#E5E7EB] pt-4">
              <span className="text-sm font-bold">Total</span>
              <span className="text-lg font-black">₹{order.total}</span>
            </div>

            <dl className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#374151]">Payment</dt>
                <dd className="font-semibold">
                  {order.payment_status === 'paid'
                    ? 'Paid online'
                    : 'Cash on Delivery'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#374151]">Deliver to</dt>
                <dd className="max-w-[60%] text-right font-semibold">
                  {order.address}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#374151]">Estimated delivery</dt>
                <dd className="font-semibold">2 to 3 days</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="w-full rounded-xl border border-transparent bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E] sm:w-auto"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-bold text-[#171717] transition hover:border-[#16803C] hover:text-[#16803C] sm:w-auto"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}