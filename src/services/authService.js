import { api } from './api'

export const authService = {
  register: (payload) => api.post('/api/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/api/auth/login', payload).then((r) => r.data),
  /** Re-validates the stored token and returns the profile. */
  me: () => api.get('/api/auth/me').then((r) => r.data),
}