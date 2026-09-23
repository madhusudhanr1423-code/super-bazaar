import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

interface CategoryItem {
  name: string
  to: '/shop'
  isSpecial?: boolean
}

const CATEGORIES: CategoryItem[] = [
  { name: 'Groceries', to: '/shop' },
  { name: 'Fashion', to: '/shop' },
  { name: 'Home & Kitchen', to: '/shop' },
  { name: 'Electronics', to: '/shop' },
  { name: 'Deals', to: '/shop', isSpecial: true },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* ========================================================================= */}
      {/* DESKTOP & TABLET NAVBAR (>= 768px)                                       */}
      {/* ========================================================================= */}
      <div className="hidden md:block border-b border-[#E5E7EB]">
        {/* Top Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-6">
            {/* Logo / Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C] rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-[#16803C] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight text-[#171717]">
                  SUPER<span className="text-[#16803C] ml-1">BAZAAR</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Large Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="flex-1 max-w-2xl relative"
            >
              <div className="relative flex items-center">
                <svg
                  className="absolute left-4 w-5 h-5 text-[#6B7280] pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search groceries, electronics, fashion & more..."
                  className="w-full h-12 pl-12 pr-28 rounded-full border border-[#E5E7EB] bg-gray-50/60 hover:bg-white focus:bg-white text-sm text-[#171717] placeholder-[#6B7280] focus:outline-none focus:border-[#16803C] focus:ring-3 focus:ring-[#16803C]/15 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[#16803C] hover:bg-[#0F5C2E] text-white text-sm font-semibold rounded-full transition-colors duration-150 flex items-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Desktop Action Icons */}
            <div className="flex items-center gap-2">
              {/* Account / Login */}
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors duration-150 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#171717] group-hover:text-[#16803C]">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <span className="block text-[11px] text-[#6B7280]">Welcome</span>
                  <span className="block font-semibold">Sign In</span>
                </div>
              </Link>

              {/* Wishlist */}
              <button
                type="button"
                aria-label="Wishlist"
                className="relative p-2.5 rounded-xl text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors duration-150 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
              >
                <div className="relative">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span className="absolute -top-2 -right-2.5 bg-[#16803C] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white">
                    0
                  </span>
                </div>
                <span className="font-semibold hidden lg:inline">Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Second Row: Category Navigation */}
        <div className="border-t border-[#E5E7EB] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-12 gap-8 text-sm" aria-label="Category Navigation">
              <Link
                to="/shop"
                className="font-semibold text-[#171717] hover:text-[#16803C] transition-colors py-1 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C] rounded"
              >
                <span>All Products</span>
              </Link>

              <div className="h-4 w-px bg-[#E5E7EB]" aria-hidden="true" />

              <div className="flex items-center gap-8">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    to={category.to}
                    className={`transition-colors py-1 font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C] rounded ${
                      category.isSpecial
                        ? 'text-[#16803C] font-semibold hover:text-[#0F5C2E]'
                        : 'text-[#171717] hover:text-[#16803C]'
                    }`}
                  >
                    {category.isSpecial && (
                      <svg
                        className="w-3.5 h-3.5 text-[#16803C]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        <path d="M5 3v4" />
                        <path d="M19 17v4" />
                        <path d="M3 5h4" />
                        <path d="M17 19h4" />
                      </svg>
                    )}
                    <span>{category.name}</span>
                    {category.isSpecial && (
                      <span className="bg-[#EAF7EF] text-[#16803C] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        Hot
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE NAVBAR (< 768px)                                                   */}
      {/* ========================================================================= */}
      <div className="md:hidden border-b border-[#E5E7EB]">
        {/* Mobile Top Row */}
        <div className="flex items-center justify-between h-14 px-4">
          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="p-2 -ml-2 rounded-lg text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>

          {/* Mobile Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C] rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-[#16803C] flex items-center justify-center text-white shadow-xs">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight text-[#171717]">
              SUPER<span className="text-[#16803C] ml-0.5">BAZAAR</span>
            </span>
          </Link>

          {/* Mobile Actions: Wishlist & Cart */}
          <div className="flex items-center gap-1">
            <Link
              to="/login"
              aria-label="Account"
              className="p-2 rounded-lg text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 rounded-lg text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16803C]"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="absolute top-1 right-1 bg-[#16803C] text-white text-[9px] font-bold h-3.5 min-w-3.5 px-0.5 rounded-full flex items-center justify-center ring-2 ring-white">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Row (Below top bar) */}
        <div className="px-4 pb-3 pt-1">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="relative flex items-center"
          >
            <svg
              className="absolute left-3.5 w-4 h-4 text-[#6B7280] pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products & categories..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-[#E5E7EB] bg-gray-50 text-sm text-[#171717] placeholder-[#6B7280] focus:outline-none focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/20 transition-all duration-150"
            />
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE NAVIGATION DRAWER                                                  */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Backdrop */}
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
          />

          {/* Slide-in Menu Panel */}
          <div className="relative w-[82%] max-w-xs h-full bg-white shadow-2xl flex flex-col overflow-y-auto transition-transform duration-300 ease-out z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#16803C] flex items-center justify-center text-white">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <span className="text-lg font-black tracking-tight text-[#171717]">
                  SUPER<span className="text-[#16803C] ml-0.5">BAZAAR</span>
                </span>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#171717] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 py-4 px-3 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Category Section */}
                <div>
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Shop Categories
                  </span>
                  <div className="mt-2 space-y-1">
                    <Link
                      to="/shop"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors"
                    >
                      <span>All Products</span>
                      <span className="text-xs text-[#6B7280]">Browse</span>
                    </Link>

                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.name}
                        to={category.to}
                        onClick={closeMobileMenu}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          category.isSpecial
                            ? 'text-[#16803C] bg-[#EAF7EF]/70 font-semibold'
                            : 'text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {category.isSpecial && (
                            <svg
                              className="w-4 h-4 text-[#16803C]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                              <path d="M5 3v4" />
                              <path d="M19 17v4" />
                              <path d="M3 5h4" />
                              <path d="M17 19h4" />
                            </svg>
                          )}
                          <span>{category.name}</span>
                        </div>
                        {category.isSpecial && (
                          <span className="bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Hot Deals
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account & Quick Links */}
                <div className="border-t border-[#E5E7EB] pt-4">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    My Account
                  </span>
                  <div className="mt-2 space-y-1">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-[#6B7280]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Sign In / Register</span>
                    </Link>

                    <button
                      type="button"
                      onClick={closeMobileMenu}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors cursor-pointer text-left"
                    >
                      <svg
                        className="w-4 h-4 text-[#6B7280]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span>Wishlist</span>
                    </button>

                    <Link
                      to="/cart"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#171717] hover:text-[#16803C] hover:bg-[#EAF7EF] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-4 h-4 text-[#6B7280]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        <span>Shopping Cart</span>
                      </div>
                      <span className="bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        0
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-[#E5E7EB] pt-4 px-3">
                <p className="text-xs text-[#6B7280]">
                  Clean & modern marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
