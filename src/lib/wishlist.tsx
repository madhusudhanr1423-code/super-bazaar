import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from './supabase'
import { useAuth } from './auth'

type WishlistContextValue = {
  ids: string[]
  count: number
  has: (productId: string) => boolean
  // Returns false when the user is not signed in
  toggle: (productId: string) => Promise<boolean>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [ids, setIds] = useState<string[]>([])

  // Load this user's wishlist whenever they sign in or out
  useEffect(() => {
    if (!user) {
      setIds([])
      return
    }

    supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setIds((data ?? []).map((row) => row.product_id as string))
      })
  }, [user])

  async function toggle(productId: string) {
    if (!user) return false

    if (ids.includes(productId)) {
      setIds((prev) => prev.filter((id) => id !== productId))
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) setIds((prev) => [...prev, productId])
    } else {
      setIds((prev) => [...prev, productId])
      const { error } = await supabase
        .from('wishlist')
        .insert({ product_id: productId })
      if (error) setIds((prev) => prev.filter((id) => id !== productId))
    }

    return true
  }

  return (
    <WishlistContext.Provider
      value={{
        ids,
        count: ids.length,
        has: (productId) => ids.includes(productId),
        toggle,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}

export function HeartButton({ productId }: { productId: string }) {
  const { has, toggle } = useWishlist()
  const navigate = useNavigate()
  const active = has(productId)

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      onClick={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const ok = await toggle(productId)
        if (!ok) navigate({ to: '/login' })
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105 ${
        active ? 'text-red-500' : 'text-[#171717] hover:text-red-500'
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  )
}