export function PageSkeleton() {
  return (
    <main className="min-h-screen bg-white" aria-busy="true" aria-label="Loading">
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-9 w-64 animate-pulse rounded bg-gray-200" />
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white"
              >
                <div className="aspect-square animate-pulse bg-gray-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-9 w-16 animate-pulse rounded-xl bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}