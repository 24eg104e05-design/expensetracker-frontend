import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Modal from '../common/Modal'

/** Paginated expense table with edit/delete actions (PRD 4.2). */
export function ExpenseList({ page, loading, currencySymbol, onEdit, onDelete }) {
  const [pendingDelete, setPendingDelete] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const symbol = currencySymbol ?? '₹'
  const expenses = page?.content ?? []

  if (loading && expenses.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-[var(--muted)]">Loading expenses…</div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-medium text-[var(--fg-2)]">No expenses match these filters</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Try widening the date range or clearing the category filter.
        </p>
      </div>
    )
  }

  const confirmDelete = async () => {
    setConfirming(true)
    try {
      await onDelete(pendingDelete.id)
      setPendingDelete(null)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <>
      <div className={`card overflow-hidden transition-opacity ${loading ? 'opacity-60' : ''}`}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border-soft)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Amount</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="table-row border-b border-[var(--border-soft)] last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">{expense.date}</td>
                <td className="px-4 py-3">
                  <span className="block font-medium text-[var(--fg)]">{expense.title}</span>
                  {expense.description ? (
                    <span
                      className="mt-0.5 block max-w-md truncate text-xs text-[var(--muted)]"
                      title={expense.description}
                    >
                      {expense.description}
                    </span>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: expense.categoryColorHex }}
                      aria-hidden="true"
                    />
                    <span className="text-[var(--fg-2)]">{expense.categoryName}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-[var(--fg)]">
                  {symbol}
                  {Number(expense.amount).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    type="button"
                    className="rounded-full p-2 text-[var(--fg-2)] hover:bg-[var(--surface)]"
                    onClick={() => onEdit(expense)}
                    aria-label={`Edit ${expense.title}`}
                  >
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-2 text-[var(--danger)] hover:bg-[var(--surface)]"
                    onClick={() => setPendingDelete(expense)}
                    aria-label={`Delete ${expense.title}`}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this expense?"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={confirming}>
              {confirming ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--fg-2)]">
          “{pendingDelete?.title}” ({symbol}
          {Number(pendingDelete?.amount ?? 0).toFixed(2)}) will be permanently removed. This cannot be
          undone.
        </p>
      </Modal>
    </>
  )
}

export default ExpenseList