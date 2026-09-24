import { Link } from '@tanstack/react-router'

const POLICIES = [
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms & Conditions' },
  { slug: 'shipping', label: 'Shipping Policy' },
  { slug: 'refunds', label: 'Returns & Refunds' },
  { slug: 'contact', label: 'Contact Us' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="text-xl font-black tracking-tight text-[#171717]">
              SUPER<span className="ml-1 text-[#16803C]">BAZAAR</span>
            </span>
            <p className="mt-3 max-w-sm text-sm text-[#6B7280]">
              Everyday essentials, fresh groceries, fashion, home products and
              electronics, delivered to your door.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-[#6B7280] hover:text-[#16803C]"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: 'Deals' }}
                  className="text-[#6B7280] hover:text-[#16803C]"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-[#6B7280] hover:text-[#16803C]"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-[#6B7280] hover:text-[#16803C]"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {POLICIES.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    to="/policy/$slug"
                    params={{ slug: policy.slug }}
                    className="text-[#6B7280] hover:text-[#16803C]"
                  >
                    {policy.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E5E7EB] pt-6 text-xs text-[#6B7280]">
          © {new Date().getFullYear()} Super Bazaar. All rights reserved.
        </div>
      </div>
    </footer>
  )
}