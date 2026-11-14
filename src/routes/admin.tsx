import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
}

type Order = {
  id: string
  customer_name: string
  phone: string
  address: string
  total: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled']

function AdminPage() {
  const { user, loading } = useAuth()

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return

    if (!user) {
      setIsAdmin(false)
      return
    }

    async function load() {
      // Is this user in the admins table?
      const { data: adminRow } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user!.id)
        .maybeSingle()

      if (!adminRow) {
        setIsAdmin(false)
        return
      }

      setIsAdmin(true)

      const { data, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })

      if (ordersError) {
        setError(ordersError.message)
        return
      }

      setOrders((data ?? []) as unknown as Order[])
    }

    load()
  }, [user, loading])

  async function updateStatus(orderId: string, status: string) {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    )
  }

  if (loading || isAdmin === null) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <p className="py-20 text-center text-sm text-[#374151]">Loading...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Not allowed</h1>
          <p className="mt-2 text-sm text-[#374151]">
            {user
              ? 'This account is not an admin.'
              : 'Please sign in with an admin account.'}
          </p>
          <Link
            to={user ? '/shop' : '/login'}
            className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
          >
            {user ? 'Back to Shop' : 'Sign In'}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
            Admin
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
            Orders
          </h1>
          <p className="mt-2 text-sm text-[#374151]">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          {orders.length === 0 && !error && (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] py-20 text-center">
              <h2 className="text-lg font-bold">No orders yet</h2>
            </div>
          )}

          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs text-[#374151]">
                    <span className="font-mono">{order.id.slice(0, 8)}</span>
                    {' · '}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <h2 className="mt-1 text-base font-bold">
                    {order.customer_name}
                  </h2>
                  <p className="text-sm text-[#374151]">{order.phone}</p>
                  <p className="mt-1 max-w-md text-sm text-[#374151]">
                    {order.address}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#16803C] sm:w-44"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-[#E5E7EB] pt-4 text-sm">
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
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}