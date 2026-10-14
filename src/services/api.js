import axios from 'axios'

/**
 * Axios instance. In dev, Vite proxies /api to the backend so the browser stays
 * same-origin; in production VITE_API_BASE_URL points at the deployed API.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_KEY = 'expensetracker.token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Attach the bearer token to every request (PRD 4.1).
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// A 401 means the token is missing, expired or invalid: clear it so AuthContext
// drops the user back to the login screen instead of looping on failed calls.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearToken()
      window.dispatchEvent(new Event('auth:expired'))
    }
    return Promise.reject(error)
  },
)

/** Normalises the ApiError envelope into a plain object for form rendering. */
export function toFieldErrors(error) {
  const data = error?.response?.data
  if (data?.fieldErrors) return data.fieldErrors
  return {}
}

export function toMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message ?? error?.message ?? fallback
}