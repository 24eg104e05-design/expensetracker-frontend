import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

function formatAmount(value, symbol) {
  return `${symbol}${Number(value ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function EmptyState() {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium text-[var(--fg-2)]">Nothing to chart yet</p>
      <p className="max-w-xs text-xs text-[var(--muted)]">
        Add your first expense and the breakdown will appear here.
      </p>
    </div>
  )
}

/**
 * Interactive category breakdown (PRD 4.4). Slice colours come from the API's
 * category records rather than the UI palette -- see DefaultCategorySeeder.
 */
export function CategoryPieChart({
  categories = [],
  currencySymbol = '₹',
  onSelectCategory,
  selectedCategoryId,
}) {
  const data = categories.map((c) => ({
    categoryId: c.categoryId,
    label: c.categoryName,
    value: Number(c.totalAmount ?? 0),
    colorHex: c.colorHex,
    percentage: c.percentage,
  }))

  return (
    <section className="card p-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--fg)]">Spending by category</h2>
        {data.length > 0 && onSelectCategory ? (
          <span className="text-xs text-[var(--muted)]">Click a slice to filter</span>
        ) : null}
      </header>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="55%"
                outerRadius="82%"
                paddingAngle={1.5}
                stroke="none"
                onClick={(entry) => onSelectCategory?.(entry.categoryId)}
              >
                {data.map((slice) => (
                  <Cell
                    key={slice.categoryId}
                    fill={slice.colorHex}
                    opacity={
                      selectedCategoryId && selectedCategoryId !== slice.categoryId ? 0.45 : 1
                    }
                    style={{ cursor: onSelectCategory ? 'pointer' : 'default' }}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [formatAmount(value, currencySymbol), name]}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border-soft)',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[var(--border-soft)] pt-4 sm:grid-cols-2">
        {data.map((slice) => (
          <li key={slice.categoryId} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.colorHex }}
                aria-hidden="true"
              />
              <span className="truncate text-[var(--fg-2)]">{slice.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-[var(--muted)]">
              {formatAmount(slice.value, currencySymbol)} · {slice.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CategoryPieChart