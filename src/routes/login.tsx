import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-green-700">
        Login
      </h1>

      <p className="mt-4 text-gray-600">
        Login to your Super Bazaar account.
      </p>
    </main>
  )
}
