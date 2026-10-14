import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { authService } from '../services/authService'
import { clearToken, getToken, setToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initialising, setInitialising] = useState(true)

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  // A 401 from any request clears the token; mirror that into React state.
  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [])

  // Restore the session on reload. The stored token is never trusted on its
  // own -- /api/auth/me re-validates it against the backend, and the 401
  // interceptor clears the token if it has expired.
  useEffect(() => {
    let cancelled = false
    if (!getToken()) {
      setInitialising(false)
      return undefined
    }
    authService
      .me()
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch(() => {
        if (!cancelled) {
          clearToken()
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setInitialising(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (fullName, email, password) => {
    await authService.register({ fullName, email, password })
    return login(email, password)
  }, [login])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), initialising, login, register, logout }),
    [user, initialising, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}