/** Date range + category filter bar (PRD 4.2). */
export function ExpenseFilterBar({ filters, categories, onChange, onReset }) {
  const update = (key) => (event) => {
    const { value } = event.target
    onChange({ ...filters, [key]: value || undefined, page: 0 })
  }

  return (
    <div className="card flex flex-wrap items-end gap-3 p-4">
      <div className="min-w-[9rem]">
        <label className="label" htmlFor="filter-start">
          From
        </label>
        <input
          id="filter-start"
          type="date"
          className="input"
          value={filters.startDate ?? ''}
          onChange={update('startDate')}
        />
      </div>

      <div className="min-w-[9rem]">
        <label className="label" htmlFor="filter-end">
          To
        </label>
        <input
          id="filter-end"
          type="date"
          className="input"
          value={filters.endDate ?? ''}
          onChange={update('endDate')}
        />
      </div>

      <div className="min-w-[12rem] flex-1">
        <label className="label" htmlFor="filter-category">
          Category
        </label>
        <select
          id="filter-category"
          className="input"
          value={filters.categoryId ?? ''}
          onChange={update('categoryId')}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

export default ExpenseFilterBar