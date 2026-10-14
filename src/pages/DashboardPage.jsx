import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import StatCards from '../components/dashboard/StatCards'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import ExpenseFilterBar from '../components/expenses/ExpenseFilterBar'
import ExpenseList from '../components/expenses/ExpenseList'
import ExpenseFormModal from '../components/expenses/ExpenseFormModal'
import CsvExportButton from '../components/export/CsvExportButton'
import { analyticsService } from '../services/analyticsService'
import { categoryService } from '../services/categoryService'
import { expenseService } from '../services/expenseService'
import { toMessage } from '../services/api'

const PAGE_SIZE = 10

export function DashboardPage() {
  const [categories, setCategories] = useState([])
  const [expenses, setExpenses] = useState({ content: [], totalPages: 0, page: 0 })
  const [overview, setOverview] = useState(null)
  const [filters, setFilters] = useState({ page: 0, startDate: undefined, endDate: undefined, categoryId: undefined })
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [banner, setBanner] = useState(null)

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await categoryService.list())
    } catch (err) {
      setBanner(toMessage(err, 'Could not load categories.'))
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const { startDate, endDate, categoryId } = filters
      const [page, scoped, byDate] = await Promise.all([
        expenseService.list({ page: filters.page, size: PAGE_SIZE, ...filters }),
        // KPIs honour the category filter so the numbers match the visible table.
        analyticsService.overview({ startDate, endDate, categoryId }),
        // The pie stays date-only: it is the control that sets categoryId.
        analyticsService.overview({ startDate, endDate }),
      ])
      setExpenses(page)
      setOverview({ ...scoped, categories: byDate.categories })
      setBanner(null)
    } catch (err) {
      setBanner(toMessage(err, 'Could not load your dashboard.'))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (expense) => {
    setEditing(expense)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await expenseService.update(editing.id, payload)
    } else {
      await expenseService.create(payload)
    }
    await loadData()
  }

  const handleDelete = async (id) => {
    try {
      await expenseService.remove(id)
      // Stepping back a page avoids landing on an empty final page.
      const nextPage =
        expenses.content.length === 1 && expenses.page > 0 ? expenses.page - 1 : expenses.page
      setFilters((current) => ({ ...current, page: nextPage }))
      if (nextPage === expenses.page) await loadData()
    } catch (err) {
      setBanner(toMessage(err, 'Could not delete this expense.'))
    }
  }

  const handleFilterChange = (next) => {
    setFilters((current) => ({ ...current, ...next }))
  }

  const resetFilters = () =>
    setFilters({ page: 0, startDate: undefined, endDate: undefined, categoryId: undefined })

  const symbol = overview?.currencySymbol ?? '₹'
  const currentPage = expenses.page ?? 0
  const totalPages = expenses.totalPages ?? 0

  return (
    <div className="min-h-screen">
      <Navbar onAddExpense={openCreate} />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        {banner ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--danger)]">
            {banner}
          </div>
        ) : null}

        <StatCards overview={overview} />

        <CategoryPieChart
          categories={overview?.categories ?? []}
          currencySymbol={symbol}
          selectedCategoryId={filters.categoryId}
          onSelectCategory={(categoryId) =>
            setFilters((current) => ({
              ...current,
              page: 0,
              categoryId: current.categoryId === categoryId ? undefined : categoryId,
            }))
          }
        />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Your expenses</h2>
          <CsvExportButton
            filters={{ startDate: filters.startDate, endDate: filters.endDate, categoryId: filters.categoryId }}
            onError={setBanner}
          />
        </div>

        <ExpenseFilterBar
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        <ExpenseList
          page={expenses}
          loading={loading}
          currencySymbol={symbol}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        {totalPages > 1 ? (
          <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={currentPage === 0 || loading}
              onClick={() => setFilters((c) => ({ ...c, page: c.page - 1 }))}
            >
              <ChevronLeft size={15} aria-hidden="true" />
              Previous
            </button>
            <span className="text-sm text-[var(--muted)]">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={currentPage + 1 >= totalPages || loading}
              onClick={() => setFilters((c) => ({ ...c, page: c.page + 1 }))}
            >
              Next
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </nav>
        ) : null}
      </main>

      <ExpenseFormModal
        open={formOpen}
        expense={editing}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default DashboardPage