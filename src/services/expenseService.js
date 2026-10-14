import { api } from './api'

export const expenseService = {
  list: ({ page = 0, size = 10, startDate, endDate, categoryId } = {}) => {
    const params = { page, size }
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (categoryId) params.categoryId = categoryId
    return api.get('/api/expenses', { params }).then((r) => r.data)
  },

  get: (id) => api.get(`/api/expenses/${id}`).then((r) => r.data),

  create: (payload) => api.post('/api/expenses', payload).then((r) => r.data),

  update: (id, payload) => api.put(`/api/expenses/${id}`, payload).then((r) => r.data),

  remove: (id) => api.delete(`/api/expenses/${id}`).then(() => true),
}