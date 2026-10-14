import { api, getToken } from './api'

export const analyticsService = {
  /**
   * KPI cards + pie slices in a single round trip.
   * `categoryId` is optional: the dashboard calls this twice, once scoped to the
   * active category filter (for the KPI cards) and once date-only (for the pie,
   * which must stay unfiltered or it could not act as its own selector).
   */
  overview: ({ startDate, endDate, categoryId } = {}) => {
    const params = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (categoryId) params.categoryId = categoryId
    return api.get('/api/analytics/overview', { params }).then((r) => r.data)
  },

  categorySummary: ({ startDate, endDate } = {}) => {
    const params = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    return api.get('/api/analytics/category-summary', { params }).then((r) => r.data)
  },

  /**
   * Downloads the filtered CSV as a blob. The server sets Content-Disposition,
   * but the filename is re-derived here because the browser cannot read that
   * header cross-origin.
   */
  async downloadCsv({ startDate, endDate, categoryId } = {}) {
    const params = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (categoryId) params.categoryId = categoryId

    const response = await api.get('/api/analytics/export/csv', { params, responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expenses_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    return true
  },

  hasToken: () => Boolean(getToken()),
}