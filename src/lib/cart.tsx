import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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
      addItem: (product) =>
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
        }),
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}