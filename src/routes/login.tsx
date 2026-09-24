import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const inputClass =
    'w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/10'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim() || password.length < 6) {
      setError('Enter your email and a password of at least 6 characters.')
      return
    }

    setSubmitting(true)

    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        navigate({ to: '/shop' })
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
      } else if (data.session) {
        // Email confirmation is off: logged in straight away
        navigate({ to: '/shop' })
      } else {
        setMessage('Account created. Check your email to confirm, then sign in.')
        setMode('signin')
      }
    }

    setSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="max-w-md mx-auto px-4 py-16">
        <Link
          to="/"
          className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
        >
          ← Back to Home
        </Link>

        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
            Super Bazaar
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            {mode === 'signin'
              ? 'Sign in to view your orders.'
              : 'Sign up to track your orders.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
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

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="At least 6 characters"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-xl bg-[#EAF7EF] px-4 py-3 text-sm font-medium text-[#16803C]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#16803C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280]">
            {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError('')
                setMessage('')
              }}
              className="font-semibold text-[#16803C] hover:text-[#0F5C2E]"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}