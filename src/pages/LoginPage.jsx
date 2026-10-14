import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { isAuthenticated, initialising } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready || initialising) return null
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg)]">Expense Tracker</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Know where your allowance actually goes.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="mb-5 text-lg font-semibold text-[var(--fg)]">Sign in</h2>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}

export default LoginPage