import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const inputClass =
    'w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/10'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Enter your email address.')
      return
    }

    setSubmitting(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/reset-password` },
    )

    setSubmitting(false)

    // Show success either way, so we never reveal which emails have accounts
    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="max-w-md mx-auto px-4 py-16">
        <Link
          to="/login"
          className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
        >
          ← Back to Sign In
        </Link>

        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">Reset password</h1>
          <p className="mt-2 text-sm text-[#374151]">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>

          {sent ? (
            <p className="mt-6 rounded-xl bg-[#EAF7EF] px-4 py-3 text-sm font-medium text-[#16803C]">
              If an account exists for that email, a reset link is on its way.
              Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#16803C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}