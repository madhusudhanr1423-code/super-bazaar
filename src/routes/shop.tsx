import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shop')({
  component: ShopPage,
})

function ShopPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-green-700">
        Shop
      </h1>

      <p className="mt-4 text-gray-600">
        Browse all products.
      </p>
    </main>
  )
}