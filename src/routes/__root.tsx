import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { CartProvider } from '../lib/cart'
import { AuthProvider } from '../lib/auth'
import { WishlistProvider } from '../lib/wishlist'

function NotFound() {
  return (
    <main className="min-h-[60vh] bg-white text-[#171717]">
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-6xl font-black text-[#16803C]">404</p>
        <h1 className="mt-4 text-2xl font-black">Page not found</h1>
        <p className="mt-2 text-sm text-[#374151]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
        >
          Go to Shop
        </Link>
      </div>
    </main>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: () => (
    <AuthProvider>
      <WishlistProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-white text-[#171717]">
          <Navbar />

          <div className="flex-1">
            <Outlet />
          </div>

          <Footer />
        </div>
      </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  ),
})