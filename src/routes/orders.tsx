import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
}

type Order = {
  id: string
  total: number
  status: string
  payment_status: string
  created_at: string
  order_items: OrderItem[]
}

const STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered']

// 'pending' = order placed and now being processed
function stepIndex(status: string) {
  if (status === 'delivered') return 3
  if (status === 'shipped') return 2
  return 1
}

function OrderTimeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
        This order was cancelled.
      </p>
    )
  }

  const current = stepIndex(status)
  const finished = status === 'delivered'

  return (
    <ol className="mt-5 flex items-start" aria-label="Order progress">
      {STEPS.map((label, i) => {
        const done = finished || i < current
        const active = !finished && i === current
        return (
          <li
            key={label}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`absolute left-[-50%] right-1/2 top-3 h-0.5 ${
                  done || active ? 'bg-[#16803C]' : 'bg-[#E5E7EB]'
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? 'bg-[#16803C] text-white'
                  : active
                    ? 'border-2 border-[#16803C] bg-white text-[#16803C]'
                    : 'border-2 border-[#E5E7EB] bg-white text-[#9CA3AF]'
              }`}
            >
              {done ? (
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`mt-2 text-xs font-semibold ${
                done || active ? 'text-[#171717]' : 'text-[#4B5563]'
              }`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function OrdersPage() {
  const { user, loading } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return

    if (!user) {
      setFetching(false)
      return
    }

    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        else setOrders((data ?? []) as unknown as Order[])
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
          <h1 className="text-2xl font-black">Sign in to see your orders</h1>
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
            My Orders
          </h1>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {orders.length === 0 && !error && (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] py-20 text-center">
              <h2 className="text-lg font-bold">No orders yet</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Orders you place while signed in will show up here.
              </p>
            </div>
          )}

          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-[#6B7280]">
                  <span className="font-mono">{order.id.slice(0, 8)}</span>
                  {' · '}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                      <span
                           className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                           order.payment_status === 'paid'
                           ? 'bg-[#EAF7EF] text-[#16803C]'
                           : 'bg-yellow-100 text-yellow-700'
                           }`}
                      >
                           {order.payment_status === 'paid' ? 'Paid' : 'Payment pending'}
                       </span>
                </div>
              </div>

              <OrderTimeline status={order.status} />

              <ul className="mt-5 space-y-1.5 border-t border-[#E5E7EB] pt-4 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <span className="text-[#6B7280]">
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
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}