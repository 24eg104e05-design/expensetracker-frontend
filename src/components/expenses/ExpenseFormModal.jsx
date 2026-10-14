import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import { toFieldErrors, toMessage } from '../../services/api'

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY = { title: '', amount: '', categoryId: '', date: today(), description: '' }

/** Add/edit expense modal with inline validation feedback (PRD 4.2). */
export function ExpenseFormModal({ open, expense, categories, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSubmitError(null)
    setForm(
      expense
        ? {
            title: expense.title,
            amount: String(expense.amount),
            categoryId: String(expense.categoryId),
            date: expense.date,
            description: expense.description ?? '',
          }
        : { ...EMPTY, date: today() },
    )
  }, [open, expense])

  const update = (key) => (event) => {
    const { value } = event.target
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  /** Client-side pass; the server remains the authority. */
  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    const amount = Number(form.amount)
    if (!form.amount.trim()) next.amount = 'Amount is required'
    else if (!Number.isFinite(amount) || amount <= 0) next.amount = 'Enter an amount greater than 0'
    else if (amount > 99999999.99) next.amount = 'Amount is too large'
    if (!form.categoryId) next.categoryId = 'Choose a category'
    if (!form.date) next.date = 'Date is required'
    else if (form.date > today()) next.date = 'Date cannot be in the future'
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError(null)

    const localErrors = validate()
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors)
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: Number(form.amount),
        categoryId: Number(form.categoryId),
        date: form.date,
        description: form.description.trim() || null,
      })
      onClose()
    } catch (err) {
      setErrors(toFieldErrors(err))
      setSubmitError(toMessage(err, 'Could not save this expense.'))
    } finally {
      setSaving(false)
    }
  }

  const isEdit = Boolean(expense)

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit expense' : 'Add expense'}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label className="label" htmlFor="expense-title">
            Title
          </label>
          <input
            id="expense-title"
            className={`input ${errors.title ? 'input-invalid' : ''}`}
            value={form.title}
            onChange={update('title')}
            placeholder="Lunch at the canteen"
            maxLength={150}
          />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="expense-amount">
              Amount (₹)
            </label>
            <input
              id="expense-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              className={`input ${errors.amount ? 'input-invalid' : ''}`}
              value={form.amount}
              onChange={update('amount')}
              placeholder="0.00"
            />
            {errors.amount ? <p className="field-error">{errors.amount}</p> : null}
          </div>

          <div>
            <label className="label" htmlFor="expense-date">
              Date
            </label>
            <input
              id="expense-date"
              type="date"
              max={today()}
              className={`input ${errors.date ? 'input-invalid' : ''}`}
              value={form.date}
              onChange={update('date')}
            />
            {errors.date ? <p className="field-error">{errors.date}</p> : null}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="expense-category">
            Category
          </label>
          <select
            id="expense-category"
            className={`input ${errors.categoryId ? 'input-invalid' : ''}`}
            value={form.categoryId}
            onChange={update('categoryId')}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? <p className="field-error">{errors.categoryId}</p> : null}
        </div>

        <div>
          <label className="label" htmlFor="expense-description">
            Description <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <textarea
            id="expense-description"
            rows={3}
            maxLength={2000}
            className="input resize-none"
            value={form.description}
            onChange={update('description')}
            placeholder="Anything worth remembering later"
          />
          {errors.description ? <p className="field-error">{errors.description}</p> : null}
        </div>

        {submitError ? (
          <p className="rounded-[var(--radius-md)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--danger)]">
            {submitError}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add expense'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ExpenseFormModal