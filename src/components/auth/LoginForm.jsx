import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toFieldErrors, toMessage } from '../../services/api'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [busy, setBusy] = useState(false)

  const update = (key) => (event) => {
    const { value } = event.target
    setForm((c) => ({ ...c, [key]: value }))
    setErrors((c) => ({ ...c, [key]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError(null)

    const next = {}
    if (!form.email.trim()) next.email = 'Email is required'
    if (!form.password) next.password = 'Password is required'
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setBusy(true)
    try {
      await login(form.email.trim(), form.password)
      navigate(location.state?.from ?? '/', { replace: true })
    } catch (err) {
      setErrors(toFieldErrors(err))
      setSubmitError(toMessage(err, 'Could not sign you in.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label className="label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className={`input ${errors.email ? 'input-invalid' : ''}`}
          value={form.email}
          onChange={update('email')}
          placeholder="you@uni.edu"
        />
        {errors.email ? <p className="field-error">{errors.email}</p> : null}
      </div>

      <div>
        <label className="label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={`input ${errors.password ? 'input-invalid' : ''}`}
          value={form.password}
          onChange={update('password')}
          placeholder="••••••••"
        />
        {errors.password ? <p className="field-error">{errors.password}</p> : null}
      </div>

      {submitError ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--danger)]">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-xs text-[var(--muted)]">
        New here?{' '}
        <Link to="/register" style={{ color: 'var(--accent)' }}>
          Create an account
        </Link>
      </p>
    </form>
  )
}

export default LoginForm