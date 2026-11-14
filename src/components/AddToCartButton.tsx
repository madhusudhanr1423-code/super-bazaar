import { useEffect, useState } from 'react'
import { useCart } from '../lib/cart'

type CartProduct = Parameters<ReturnType<typeof useCart>['addItem']>[0]

export function AddToCartButton({
  product,
  disabled = false,
}: {
  product: CartProduct
  disabled?: boolean
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1500)
    return () => clearTimeout(timer)
  }, [added])

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem(product)
        setAdded(true)
      }}
      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-150 cursor-pointer flex items-center gap-1.5 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[#E5E7EB] disabled:text-[#374151] ${
        added
          ? 'bg-[#EAF7EF] text-[#16803C] border-[#16803C]'
          : 'bg-[#16803C] hover:bg-[#0F5C2E] text-white border-transparent'
      }`}
    >
      {added ? (
        <>
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Added</span>
        </>
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          <span>Add</span>
        </>
      )}
    </button>
  )
}