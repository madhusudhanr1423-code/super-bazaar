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
  created_at: string
  order_items: OrderItem[]
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
                <span className="rounded-full bg-[#EAF7EF] px-3 py-1 text-[11px] font-bold uppercase text-[#16803C]">
                  {order.status}
                </span>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-[#E5E7EB] pt-4 text-sm">
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