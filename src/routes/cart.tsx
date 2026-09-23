import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-green-700">
        Your Cart
      </h1>

      <p className="mt-4 text-gray-600">
        Your cart is currently empty.
      </p>
    </main>
  )
}