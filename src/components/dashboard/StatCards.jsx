import { PieChart as PieChartIcon, TrendingUp, Trophy, Wallet } from 'lucide-react'

function formatAmount(value, symbol) {
  const amount = Number(value ?? 0)
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** KPI cards (PRD 4.4): Total Spent, Top Category, Average Daily Spend. */
export function StatCards({ overview }) {
  if (!overview) return null

  const symbol = overview.currencySymbol ?? '₹'
  const cards = [
    {
      label: 'Total Spent',
      value: formatAmount(overview.totalSpent, symbol),
      numeric: true,
      hint: `${overview.startDate} → ${overview.endDate}`,
      Icon: Wallet,
      accent: 'var(--accent)',
    },
    {
      label: 'Top Category',
      value: overview.topCategoryName ?? '—',
      // Text values wrap rather than truncate: a half-shown category name is
      // useless, and the hint below carries the exact amount.
      numeric: false,
      hint: overview.topCategoryAmount != null
        ? formatAmount(overview.topCategoryAmount, symbol)
        : 'No spending yet',
      Icon: Trophy,
      accent: overview.topCategoryColorHex ?? 'var(--muted)',
    },
    {
      label: 'Average Daily',
      value: formatAmount(overview.averageDailySpend, symbol),
      numeric: true,
      hint: `Across ${overview.inclusiveDayCount} day${overview.inclusiveDayCount === 1 ? '' : 's'}`,
      Icon: TrendingUp,
      accent: 'var(--fg-2)',
    },
    {
      label: 'Categories Used',
      value: String(overview.categories?.length ?? 0),
      numeric: true,
      hint: `${overview.distinctDaysWithSpending} day${overview.distinctDaysWithSpending === 1 ? '' : 's'} with spending`,
      Icon: PieChartIcon,
      accent: 'var(--warn)',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, numeric, hint, Icon, accent }) => (
        <article key={label} className="card flex flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</span>
            <Icon size={16} style={{ color: accent }} aria-hidden="true" className="shrink-0" />
          </div>
          <p
            className={`mt-3 font-semibold leading-tight text-[var(--fg)] ${
              numeric
                ? 'truncate text-2xl tabular-nums'
                : 'text-xl leading-snug break-words hyphens-auto'
            }`}
            title={value}
          >
            {value}
          </p>
          <p className="mt-1 truncate text-xs text-[var(--muted)]">{hint}</p>
        </article>
      ))}
    </div>
  )
}

export default StatCards