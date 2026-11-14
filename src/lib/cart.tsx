import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  image_url: string | null
  qty: number
}

type CartProduct = Omit<CartItem, 'qty'>

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addItem: (product: CartProduct) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'super-bazaar-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load saved cart once, in the browser only
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {
      // ignore broken saved data
    }
    setLoaded(true)
  }, [])

  // Save cart whenever it changes (after the first load)
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      addItem: (product) => {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === product.id)
          if (existing) {
            return prev.map((i) =>
              i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
            )
          }
          return [
            ...prev,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              qty: 1,
            },
          ]
        })
      },
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    }),
    [items],
  )

  // Floating cart bar: stays visible as long as the cart has items
  const pathname = useRouterState({ select: (st) => st.location.pathname })
  const hideBar =
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/admin')
  const lastItem = items[items.length - 1]
  const showBar = loaded && items.length > 0 && !hideBar

  return (
    <CartContext.Provider value={value}>
      {children}

      {showBar && lastItem && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-lg">
            {lastItem.image_url && (
              <img
                src={lastItem.image_url}
                alt=""
                className="h-12 w-12 shrink-0 rounded-xl bg-gray-50 object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#171717]">
                {value.count} {value.count === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="truncate text-xs text-[#4B5563]">
                Subtotal ₹{value.total}
              </p>
            </div>
            <Link
              to="/cart"
              className="shrink-0 rounded-xl bg-[#16803C] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#0F5C2E]"
            >
              View cart
            </Link>
          </div>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}