import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()

  // Supabase's reset link signs the browser in automatically; we just
  // wait a moment for that to happen before showing the form.
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const inputClass =
    'w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/10'

  useEffect(() => {
    supabase.auth.getSession().then(() => setReady(true))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setDone(true)
    setTimeout(() => navigate({ to: '/shop' }), 2000)
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <p className="py-20 text-center text-sm text-[#374151]">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">
            Set new password
          </h1>

          {done ? (
            <p className="mt-6 rounded-xl bg-[#EAF7EF] px-4 py-3 text-sm font-medium text-[#16803C]">
              Password updated. Redirecting you to the shop...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
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
                {submitting ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-6 block text-center text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            Back to Sign In
          </Link>
        </div>
      </section>
    </main>
  )
}