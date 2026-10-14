import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toFieldErrors, toMessage } from '../../services/api'

export function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
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
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 8) next.password = 'Use at least 8 characters'
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      next.password = 'Include at least one letter and one number'
    }
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setBusy(true)
    try {
      await register(form.fullName.trim(), form.email.trim(), form.password)
      navigate('/', { replace: true })
    } catch (err) {
      setErrors(toFieldErrors(err))
      setSubmitError(toMessage(err, 'Could not create your account.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label className="label" htmlFor="register-name">
          Full name
        </label>
        <input
          id="register-name"
          autoComplete="name"
          className={`input ${errors.fullName ? 'input-invalid' : ''}`}
          value={form.fullName}
          onChange={update('fullName')}
          placeholder="Alice Sharma"
          maxLength={100}
        />
        {errors.fullName ? <p className="field-error">{errors.fullName}</p> : null}
      </div>

      <div>
        <label className="label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
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
        <label className="label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          className={`input ${errors.password ? 'input-invalid' : ''}`}
          value={form.password}
          onChange={update('password')}
          placeholder="At least 8 characters"
        />
        {errors.password ? <p className="field-error">{errors.password}</p> : null}
      </div>

      {submitError ? (
        <p className="rounded-[var(--radius-md)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--danger)]">
          {submitError}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-xs text-[var(--muted)]">
        Already registered?{' '}
        <Link to="/login" style={{ color: 'var(--accent)' }}>
          Sign in
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm