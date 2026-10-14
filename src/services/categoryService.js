import { api } from './api'

export const categoryService = {
  list: () => api.get('/api/categories').then((r) => r.data),
  create: (payload) => api.post('/api/categories', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/categories/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/categories/${id}`).then(() => true),
}